module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/whatsapp/send',
      handler: 'whatsapp.sendMessage',  
      config: {
        auth: false,
      },
    },
  ],
};
