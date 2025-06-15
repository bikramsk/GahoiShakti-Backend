module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/api/check-user/:mobileNumber',
      handler: 'mobile-user.checkUser',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/verify-mpin',
      handler: 'mobile-user.verifyMPIN',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/send-otp',
      handler: 'mobile-user.sendOTP',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/verify-otp',
      handler: 'mobile-user.verifyOTP',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/api/set-mpin',
      handler: 'mobile-user.setMPIN',
      config: {
        auth: false
      }
    }
  ]
}; 