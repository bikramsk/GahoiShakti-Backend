module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/api/check-user-mpin/:mobileNumber',
      handler: 'auth.checkUserAndMPIN',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/verify-mpin',
      handler: 'auth.verifyMPIN',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/send-whatsapp-otp',
      handler: 'auth.sendWhatsAppOTP',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/verify-otp',
      handler: 'auth.verifyOTP',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/set-mpin',
      handler: 'auth.setMPIN',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/send-direct-whatsapp',
      handler: 'auth.sendDirectWhatsApp',
      config: {
        auth: false
      }
    }
  ]
}; 