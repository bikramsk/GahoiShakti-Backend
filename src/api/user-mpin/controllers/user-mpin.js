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

      // Also consider entries in registration-pages by matching personal_information.mobile_number
      let registrationExists = false;
      try {
        const mobileNumInt = Number(mobileNumber);
        if (!Number.isNaN(mobileNumInt)) {
          // Try numeric match (common for biginteger)
          const reg = await strapi.db.query('api::registration-page.registration-page').findOne({
            where: { personal_information: { mobile_number: mobileNumInt } },
            select: ['id']
          });
          registrationExists = !!reg;

          // If not found and the DB stores as string, try string match as a fallback
          if (!registrationExists) {
            const regStr = await strapi.db.query('api::registration-page.registration-page').findOne({
              where: { personal_information: { mobile_number: mobileNumber } },
              select: ['id']
            });
            registrationExists = !!regStr;
          }
        }
      } catch (e) {
        registrationExists = false;
      }

      return {
        exists: !!user || registrationExists,
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

