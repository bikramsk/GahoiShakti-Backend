module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/mobile-check',
      handler: 'mobile-check.check',
      config: {
        auth: false
      }
    }
  ]
}
