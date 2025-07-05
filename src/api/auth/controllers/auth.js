'use strict';

const crypto = require('crypto');

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); 
};

const isValidMobileNumber = (mobileNumber) => {
  return /^[0-9]{10}$/.test(mobileNumber);
};

const isValidMPIN = (mpin) => {
  return /^[0-9]{4}$/.test(mpin);
};

const hashMPIN = (mpin) => {
  return crypto.createHash('sha256').update(mpin).digest('hex');
};

const sendWhatsAppMessage = async (to, otp) => {
  try {
    console.log('Attempting to send WhatsApp message to:', to);
    console.log('API Key:', process.env.WHATSAPP_API_TOKEN ? 'Present' : 'Missing');

    if (!process.env.WHATSAPP_API_TOKEN) {
      throw new Error('WhatsApp API Token not configured');
    }

    if (!process.env.WHATSAPP_BUSINESS_PHONE_NUMBER) {
      throw new Error('WhatsApp Business Phone Number not configured');
    }

    const response = await fetch('https://www.wpsenders.in/api/sendRTMessage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        api_key: process.env.WHATSAPP_API_TOKEN,
        number: to.toString(),
        message: `Your OTP for Gahoi Shakti login is: ${otp}.`,
        route: '1',
        country_code: '91',
        from: process.env.WHATSAPP_BUSINESS_PHONE_NUMBER
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API error response:', errorText);
      throw new Error(`WhatsApp API returned status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('WPSenders API Response:', responseData);

    if (!responseData.status) {
      console.error('WhatsApp API error:', responseData);
      throw new Error(responseData.message || 'WPSenders API Error');
    }

    return responseData;
  } catch (error) {
    console.error('WhatsApp send error details:', error);
    throw error;
  }
};

module.exports = {
  async checkUserAndMPIN(ctx) {
    try {
      const { mobileNumber } = ctx.params;

      if (!isValidMobileNumber(mobileNumber)) {
        return ctx.badRequest('Invalid mobile number format');
      }

      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { mobileNumber }
      });

      return {
        exists: !!user,
        hasMPIN: user ? !!user.mpin : false
      };
    } catch (error) {
      console.error('Check user error:', error);
      return ctx.badRequest('Error checking user status');
    }
  },

  async verifyMPIN(ctx) {
    try {
      const { mobileNumber, mpin } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { mobileNumber }
      });

      if (!user || !user.mpin || user.mpin !== hashMPIN(mpin)) {
        return ctx.badRequest('Invalid MPIN');
      }

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id
      });

      return {
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          mobileNumber: user.mobileNumber
        }
      };
    } catch (error) {
      console.error('MPIN verification error:', error);
      return ctx.badRequest('Error verifying MPIN');
    }
  },

  async sendWhatsAppOTP(ctx) {
    try {
      console.log('Request body:', ctx.request.body);
      const { mobileNumber } = ctx.request.body;
      console.log('Received mobileNumber:', mobileNumber);

      if (!isValidMobileNumber(mobileNumber)) {
        console.log('Invalid mobile number:', mobileNumber);
        return ctx.badRequest('Invalid mobile number format');
      }

      // Check if user exists and has completed registration
      const registrationPage = await strapi.query('api::registration-page.registration-page').findOne({
        where: { 
          'personal_information.mobile_number': mobileNumber
        }
      });

      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { mobileNumber }
      });

      const otp = generateOTP();
      console.log('Generated OTP:', otp);
      
      try {
        const result = await sendWhatsAppMessage(mobileNumber, otp);
        console.log('WhatsApp API response:', result);

        // Store OTP in session instead of creating user
        ctx.session = ctx.session || {};
        ctx.session.otpData = {
          mobileNumber,
          otp: hashMPIN(otp),
          sentAt: new Date(),
          attempts: 0
        };

        return {
          success: true,
          message: 'OTP sent successfully',
          otp: process.env.NODE_ENV === 'development' ? otp : undefined,
          isRegistered: !!registrationPage,
          hasMpin: user?.mpin ? true : false
        };
      } catch (error) {
        console.error('WhatsApp send error:', error);
        return ctx.badRequest('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return ctx.badRequest('Error sending OTP');
    }
  },

  async verifyOTP(ctx) {
    try {
      const { mobileNumber, otp } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber) || !otp || otp.length !== 4) {
        return ctx.badRequest('Invalid input format');
      }

      // Check session OTP data
      if (!ctx.session?.otpData || 
          ctx.session.otpData.mobileNumber !== mobileNumber ||
          ctx.session.otpData.otp !== hashMPIN(otp)) {
        return ctx.badRequest('Invalid OTP');
      }

      // Check OTP expiry (10 minutes)
      const otpSentAt = new Date(ctx.session.otpData.sentAt);
      const expiryTime = new Date(otpSentAt.getTime() + 10 * 60000);
      if (new Date() > expiryTime) {
        return ctx.badRequest('OTP has expired. Please request a new one.');
      }

      // Check if user exists and has completed registration
      const registrationPage = await strapi.query('api::registration-page.registration-page').findOne({
        where: { 
          'personal_information.mobile_number': mobileNumber
        }
      });

      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { mobileNumber }
      });

      // Clear OTP data
      delete ctx.session.otpData;

      // Only return JWT if registration is complete and user exists
      if (registrationPage && user) {
        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id
        });
        return {
          jwt,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            mobileNumber: user.mobileNumber,
            hasMPIN: !!user.mpin
          }
        };
      }

      // For unregistered users, just return success without JWT
      return {
        success: true,
        isRegistered: false,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return ctx.badRequest('Error verifying OTP');
    }
  },

  async setMPIN(ctx) {
    try {
      const { mobileNumber, mpin } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { mobileNumber }
      });

      if (!user) {
        return ctx.badRequest('User not found');
      }

      await strapi.query('plugin::users-permissions.user').update({
        where: { id: user.id },
        data: {
          mpin: hashMPIN(mpin)
        }
      });

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id
      });

      return {
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          mobileNumber: user.mobileNumber
        }
      };
    } catch (error) {
      console.error('Set MPIN error:', error);
      return ctx.badRequest('Error setting MPIN');
    }
  },

  async sendDirectWhatsApp(ctx) {
    try {
      const { number, message } = ctx.request.body;
      
      const response = await fetch('https://www.wpsenders.in/api/sendMessage', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          api_key: process.env.WHATSAPP_API_TOKEN,
          number: number,
          message: message,
          route: '1',
          country_code: '91'
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Direct WhatsApp send error:', error);
      return ctx.badRequest(error.message);
    }
  }
};



