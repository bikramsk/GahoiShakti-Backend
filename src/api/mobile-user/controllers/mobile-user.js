'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, mobileNumber: user.mobileNumber },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const sendWhatsAppMessage = async (to, otp) => {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_NUMBER;
  
  if (!token || !phoneNumberId) {
    throw new Error('WhatsApp API credentials not configured');
  }

  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: `91${to}`, // Adding India country code
      type: "template",
      template: {
        name: "otp_alert",
        language: {
          code: "en"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otp
              }
            ]
          }
        ]
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`WhatsApp API Error: ${JSON.stringify(error)}`);
  }

  return await response.json();
};

module.exports = {
  async checkUser(ctx) {
    try {
      const { mobileNumber } = ctx.params;

      if (!isValidMobileNumber(mobileNumber)) {
        return ctx.badRequest('Invalid mobile number format');
      }

      const user = await strapi.db.query('api::mobile-user.mobile-user').findOne({
        where: { mobileNumber }
      });

      return {
        exists: !!user,
        hasMPIN: user ? !!user.mpin : false,
        isRegistered: user ? user.isRegistered : false
      };
    } catch (error) {
      return ctx.badRequest('Error checking user status');
    }
  },

  async verifyMPIN(ctx) {
    try {
      const { mobileNumber, mpin } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.db.query('api::mobile-user.mobile-user').findOne({
        where: { mobileNumber }
      });

      if (!user || !user.mpin || user.mpin !== hashMPIN(mpin)) {
        return ctx.badRequest('Invalid MPIN');
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          name: user.name,
          isRegistered: user.isRegistered
        }
      };
    } catch (error) {
      return ctx.badRequest('Error verifying MPIN');
    }
  },

  async sendOTP(ctx) {
    try {
      const { mobileNumber } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber)) {
        return ctx.badRequest('Invalid mobile number format');
      }

      // Check if user is blocked
      const user = await strapi.db.query('api::mobile-user.mobile-user').findOne({
        where: { mobileNumber }
      });

      if (user?.isBlocked && user.blockUntil && new Date(user.blockUntil) > new Date()) {
        return ctx.badRequest('Account is temporarily blocked. Try again later.');
      }

      const otp = generateOTP();
      
      try {
        if (process.env.NODE_ENV === 'production') {
          await sendWhatsAppMessage(mobileNumber, otp);
        }

        const userData = {
          lastOtp: hashMPIN(otp),
          lastOtpSent: new Date(),
          otpAttempts: 0,
          isBlocked: false,
          blockUntil: null
        };

        if (!user) {
          // Create new user if doesn't exist
          await strapi.db.query('api::mobile-user.mobile-user').create({
            data: {
              mobileNumber,
              ...userData
            }
          });
        } else {
          // Update existing user
          await strapi.db.query('api::mobile-user.mobile-user').update({
            where: { id: user.id },
            data: userData
          });
        }

        return {
          success: true,
          message: 'OTP sent successfully',
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        };
      } catch (error) {
        console.error('WhatsApp API Error:', error);
        return ctx.badRequest('Failed to send OTP via WhatsApp');
      }
    } catch (error) {
      return ctx.badRequest('Error sending OTP');
    }
  },

  async verifyOTP(ctx) {
    try {
      const { mobileNumber, otp } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber) || !otp || otp.length !== 6) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.db.query('api::mobile-user.mobile-user').findOne({
        where: { mobileNumber }
      });

      if (!user) {
        return ctx.badRequest('User not found');
      }

      if (user.isBlocked && user.blockUntil && new Date(user.blockUntil) > new Date()) {
        return ctx.badRequest('Account is temporarily blocked. Try again later.');
      }

      if (!user.lastOtp || !user.lastOtpSent) {
        return ctx.badRequest('No OTP was sent');
      }

      // Check if OTP is expired (5 minutes)
      const otpExpiry = new Date(user.lastOtpSent);
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
      
      if (new Date() > otpExpiry) {
        return ctx.badRequest('OTP has expired');
      }

      if (user.lastOtp !== hashMPIN(otp)) {
        // Increment attempts
        const attempts = (user.otpAttempts || 0) + 1;
        const updateData = { otpAttempts: attempts };

        // Block account after 5 failed attempts
        if (attempts >= 5) {
          const blockUntil = new Date();
          blockUntil.setMinutes(blockUntil.getMinutes() + 30);
          updateData.isBlocked = true;
          updateData.blockUntil = blockUntil;
        }

        await strapi.db.query('api::mobile-user.mobile-user').update({
          where: { id: user.id },
          data: updateData
        });

        return ctx.badRequest('Invalid OTP');
      }

      // Clear OTP data after successful verification
      await strapi.db.query('api::mobile-user.mobile-user').update({
        where: { id: user.id },
        data: {
          lastOtp: null,
          otpAttempts: 0,
          isBlocked: false,
          blockUntil: null
        }
      });

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          name: user.name,
          isRegistered: user.isRegistered
        }
      };
    } catch (error) {
      return ctx.badRequest('Error verifying OTP');
    }
  },

  async setMPIN(ctx) {
    try {
      const { mobileNumber, mpin } = ctx.request.body;

      if (!isValidMobileNumber(mobileNumber) || !isValidMPIN(mpin)) {
        return ctx.badRequest('Invalid input format');
      }

      const user = await strapi.db.query('api::mobile-user.mobile-user').findOne({
        where: { mobileNumber }
      });

      if (!user) {
        return ctx.badRequest('User not found');
      }

      await strapi.db.query('api::mobile-user.mobile-user').update({
        where: { id: user.id },
        data: {
          mpin: hashMPIN(mpin)
        }
      });

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          name: user.name,
          isRegistered: user.isRegistered
        }
      };
    } catch (error) {
      return ctx.badRequest('Error setting MPIN');
    }
  }
}; 