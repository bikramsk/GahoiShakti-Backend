module.exports = {
  routes: [
    // Check user and MPIN status
    {
      method: 'GET',
      path: '/check-user-mpin/:mobileNumber',
      handler: 'user-mpin.checkUserAndMPIN',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Send WhatsApp OTP
    {
      method: 'POST',
      path: '/send-whatsapp-otp',
      handler: 'user-mpin.sendWhatsAppOTP',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Verify OTP
    {
      method: 'POST',
      path: '/verify-otp',
      handler: 'user-mpin.verifyOTP',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Verify MPIN
    {
      method: 'POST',
      path: '/verify-mpin',
      handler: 'user-mpin.verifyMPIN',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Set MPIN (protected route)
    {
      method: 'POST',
      path: '/create-mpin',
      handler: 'user-mpin.setMPIN',
      config: {
        auth: false, 
        policies: [],
        middlewares: [],
      },
    },
  ],
};