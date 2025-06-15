module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/send-sms',
      handler: 'sms.send', 
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    }
  ]
};