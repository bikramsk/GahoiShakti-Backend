'use strict';

const crypto = require('crypto');
const { createCoreController } = require('@strapi/strapi').factories;

const MPIN_PROXY_USER_ID = 1; // This should be the ID of the MPIN proxy user in your database

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const isValidMobileNumber = (mobileNumber) => /^[0-9]{10}$/.test(mobileNumber);
const isValidMPIN = (mpin) => /^[0-9]{4}$/.test(mpin);
const hashMPIN = (mpin) => crypto.createHash('sha256').update(mpin).digest('hex');

const sendWhatsAppMessage = async (to, otp) => {
  const apiKey = "HVW5LEKQ81BPR3SJU6F7TCMYZ";
  const url = "https://www.wpsenders.in/api/sendRTMessage";
  const message = `Your OTP for Gahoi Shakti login is: ${otp}. This OTP will expire in 10 minutes.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      api_key: apiKey,
      message,
      number: to,
      route: '1',
      country_code: '91'
    })
  });

  const responseText = await response.text();
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid response from WhatsApp API: ${responseText}`);
  }

  if (!response.ok || !responseData.status) {
    throw new Error(`WhatsApp send failed: ${responseData.message || 'Unknown error'}`);
  }

  return responseData;
};

module.exports = createCoreController('api::user-mpin.user-mpin', ({ strapi }) => ({
  async checkUserAndMPIN(ctx) {
    try {
      const { mobileNumber } = ctx.params;
      if (!isValidMobileNumber(mobileNumber)) return ctx.badRequest('Invalid mobile number format');

      const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
        where: { mobileNumber }
      });

      return {
        exists: !!user,
        hasMpin: user ? !!user.mpin : false
      };
    } catch {
      return ctx.badRequest('Error checking user status');
    }
  },

  async verifyMPIN(ctx) {
    try {
      const { mobileNumber, mpin } = ctx.request.body;
      if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
        where: { mobileNumber }
      });

      if (!user || !user.mpin || user.mpin !== hashMPIN(mpin)) {
        return ctx.badRequest('Invalid MPIN');
      }

      const token = strapi.plugins['users-permissions'].services.jwt.issue({
        id: MPIN_PROXY_USER_ID
      });

      return {
        jwt: token,
        isRegistered: true
      };
    } catch {
      return ctx.badRequest('Error verifying MPIN');
    }
  },

  async sendWhatsAppOTP(ctx) {
    try {
      const { mobileNumber } = ctx.request.body;
      if (!isValidMobileNumber(mobileNumber)) return ctx.badRequest('Invalid mobile number format');

      const otp = generateOTP();
      await sendWhatsAppMessage(mobileNumber, otp);

      const existingUser = await strapi.db.query('api::user-mpin.user-mpin').findOne({
        where: { mobileNumber }
      });

      const userData = {
        mobileNumber,
        lastOtp: hashMPIN(otp),
        lastOtpSent: new Date()
      };

      if (!existingUser) {
        await strapi.db.query('api::user-mpin.user-mpin').create({ data: userData });
      } else {
        await strapi.db.query('api::user-mpin.user-mpin').update({
          where: { id: existingUser.id },
          data: userData
        });
      }

      return {
        success: true,
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      };
    } catch (error) {
      return ctx.badRequest(`Error sending OTP: ${error.message}`);
    }
  },

  async verifyOTP(ctx) {
    try {
      const { mobileNumber, otp } = ctx.request.body;
      if (!isValidMobileNumber(mobileNumber) || !otp || otp.length !== 4) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
        where: { mobileNumber }
      });

      if (!user || !user.lastOtp || !user.lastOtpSent) {
        return ctx.badRequest('User not found or OTP not sent');
      }

      const otpExpiry = new Date(user.lastOtpSent);
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
      if (new Date() > otpExpiry) return ctx.badRequest('OTP has expired');
      if (user.lastOtp !== hashMPIN(otp)) return ctx.badRequest('Invalid OTP');

      await strapi.db.query('api::user-mpin.user-mpin').update({
        where: { id: user.id },
        data: { lastOtp: null }
      });

      const token = strapi.plugins['users-permissions'].services.jwt.issue({
        id: MPIN_PROXY_USER_ID
      });

      return {
        jwt: token,
        hasMpin: !!user.mpin,
        isRegistered: !!user.mpin
      };
    } catch {
      return ctx.badRequest('Error verifying OTP');
    }
  },

  async setMPIN(ctx) {
    try {
      const { mobileNumber, mpin } = ctx.request.body;
      if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
        where: { mobileNumber }
      });

      if (!user) {
        return ctx.badRequest('User not found');
      }

      await strapi.db.query('api::user-mpin.user-mpin').update({
        where: { id: user.id },
        data: {
          mpin: hashMPIN(mpin)
        }
      });

      const token = strapi.plugins['users-permissions'].services.jwt.issue({
        id: MPIN_PROXY_USER_ID
      });

      return {
        jwt: token,
        isRegistered: true
      };
    } catch {
      return ctx.badRequest('Error setting MPIN');
    }
  }
}));







// 'use strict';

// const crypto = require('crypto');
// const { createCoreController } = require('@strapi/strapi').factories;

// const generateOTP = () => {
//   return Math.floor(1000 + Math.random() * 9000).toString(); 
// };

// const isValidMobileNumber = (mobileNumber) => {
//   return /^[0-9]{10}$/.test(mobileNumber);
// };

// const isValidMPIN = (mpin) => {
//   return /^[0-9]{4}$/.test(mpin);
// };

// const hashMPIN = (mpin) => {
//   return crypto.createHash('sha256').update(mpin).digest('hex');
// };

// const sendWhatsAppMessage = async (to, otp) => {
//   const apiKey = "S4YKGP5ZB9Q2J8LIDNM6OACTX";
//   const url = "https://www.wpsenders.in/api/sendRTMessage";
  
//   const message = `Your OTP for Gahoi Shakti login is: ${otp}. This OTP will expire in 10 minutes.`;

//   try {
//     console.log('WhatsApp API Request:', {
//       url,
//       number: to,
//       hasApiKey: !!apiKey
//     });
    
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({
//         api_key: apiKey,
//         message: message,
//         number: to,
//         route: '1',
//         country_code: '91'
//       })
//     });

//     console.log('WhatsApp API Response Status:', response.status);
//     const responseText = await response.text();
//     console.log('WhatsApp API Raw Response:', responseText);

//     let responseData;
//     try {
//       responseData = JSON.parse(responseText);
//       console.log('WhatsApp API Parsed Response:', responseData);
//     } catch (parseError) {
//       console.error('Failed to parse WhatsApp API response:', parseError);
//       throw new Error(`Invalid response from WhatsApp API: ${responseText}`);
//     }

//     if (!response.ok) {
//       throw new Error(`WhatsApp API error (${response.status}): ${JSON.stringify(responseData)}`);
//     }

//     if (!responseData.status) {
//       throw new Error(`WhatsApp send failed: ${responseData.message || 'Unknown error'}`);
//     }

//     return responseData;
//   } catch (error) {
//     console.error('WhatsApp send error details:', error);
//     throw error;
//   }
// };

// module.exports = createCoreController('api::user-mpin.user-mpin', ({ strapi }) => ({
//   async checkUserAndMPIN(ctx) {
//     try {
//       const { mobileNumber } = ctx.params;

//       if (!isValidMobileNumber(mobileNumber)) {
//         return ctx.badRequest('Invalid mobile number format');
//       }

//       const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
//         where: { mobileNumber }
//       });

//       return {
//         exists: !!user,
//         hasMpin: user ? !!user.mpin : false
//       };
//     } catch (error) {
//       return ctx.badRequest('Error checking user status');
//     }
//   },

//   async verifyMPIN(ctx) {
//     try {
//       const { mobileNumber, mpin } = ctx.request.body;

//       if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
//         return ctx.badRequest('Invalid input format');
//       }

//       const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
//         where: { mobileNumber }
//       });

//       if (!user || !user.mpin || user.mpin !== hashMPIN(mpin)) {
//         return ctx.badRequest('Invalid MPIN');
//       }

//       // Generate JWT token
//       const token = strapi.plugins['users-permissions'].services.jwt.issue({
//         id: user.id,
//         mobileNumber: user.mobileNumber
//       });

//       return {
//         jwt: token,
//         isRegistered: true
//       };
//     } catch (error) {
//       return ctx.badRequest('Error verifying MPIN');
//     }
//   },

//   async sendWhatsAppOTP(ctx) {
//     try {
//       const { mobileNumber } = ctx.request.body;
//       console.log('Received OTP request for mobile:', mobileNumber);

//       if (!isValidMobileNumber(mobileNumber)) {
//         return ctx.badRequest('Invalid mobile number format');
//       }

//       const otp = generateOTP();
//       console.log('Generated OTP:', otp);
      
//       try {
//         const result = await sendWhatsAppMessage(mobileNumber, otp);
//         console.log('WhatsApp send result:', result);
        
//         // Check if user exists
//         const existingUser = await strapi.db.query('api::user-mpin.user-mpin').findOne({
//           where: { mobileNumber }
//         });

//         const userData = {
//           mobileNumber,
//           lastOtp: hashMPIN(otp),
//           lastOtpSent: new Date()
//         };

//         if (!existingUser) {
//           await strapi.db.query('api::user-mpin.user-mpin').create({
//             data: userData
//           });
//         } else {
//           await strapi.db.query('api::user-mpin.user-mpin').update({
//             where: { id: existingUser.id },
//             data: userData
//           });
//         }

//         return {
//           success: true,
//           message: 'OTP sent successfully',
//           otp: process.env.NODE_ENV === 'development' ? otp : undefined
//         };
//       } catch (error) {
//         console.error('WhatsApp API Error:', error);
//         return ctx.badRequest(`Failed to send OTP: ${error.message}`);
//       }
//     } catch (error) {
//       console.error('Send OTP error:', error);
//       return ctx.badRequest(`Error in OTP process: ${error.message}`);
//     }
//   },

//   async verifyOTP(ctx) {
//     try {
//       const { mobileNumber, otp } = ctx.request.body;

//       if (!isValidMobileNumber(mobileNumber) || !otp || otp.length !== 4) {
//         return ctx.badRequest('Invalid input format');
//       }

//       const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
//         where: { mobileNumber }
//       });

//       if (!user) {
//         return ctx.badRequest('User not found');
//       }

//       if (!user.lastOtp || !user.lastOtpSent) {
//         return ctx.badRequest('No OTP was sent');
//       }

//       // Check if OTP is expired (10 minutes)
//       const otpExpiry = new Date(user.lastOtpSent);
//       otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
      
//       if (new Date() > otpExpiry) {
//         return ctx.badRequest('OTP has expired');
//       }

//       if (user.lastOtp !== hashMPIN(otp)) {
//         return ctx.badRequest('Invalid OTP');
//       }

//       // Clear OTP data after successful verification
//       await strapi.db.query('api::user-mpin.user-mpin').update({
//         where: { id: user.id },
//         data: {
//           lastOtp: null
//         }
//       });

//       // Generate JWT token
//       const token = strapi.plugins['users-permissions'].services.jwt.issue({
//         id: user.id,
//         mobileNumber: user.mobileNumber
//       });

//       return {
//         jwt: token,
//         hasMpin: !!user.mpin,
//         isRegistered: !!user.mpin // Consider user registered if they have set MPIN
//       };
//     } catch (error) {
//       return ctx.badRequest('Error verifying OTP');
//     }
//   },

//   async setMPIN(ctx) {
//     try {
//       const { mobileNumber, mpin } = ctx.request.body;

//       if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
//         return ctx.badRequest('Invalid input format');
//       }

//       const user = await strapi.db.query('api::user-mpin.user-mpin').findOne({
//         where: { mobileNumber }
//       });

//       if (!user) {
//         return ctx.badRequest('User not found');
//       }

//       await strapi.db.query('api::user-mpin.user-mpin').update({
//         where: { id: user.id },
//         data: {
//           mpin: hashMPIN(mpin)
//         }
//       });

//       // Generate JWT token
//       const token = strapi.plugins['users-permissions'].services.jwt.issue({
//         id: user.id,
//         mobileNumber: user.mobileNumber
//       });

//       return {
//         jwt: token,
//         isRegistered: true
//       };
//     } catch (error) {
//       return ctx.badRequest('Error setting MPIN');
//     }
//   }
// })); 