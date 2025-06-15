'use strict';

const fetch = require('node-fetch'); 

module.exports = {
  async sendMessage(ctx) {
    const { number, message } = ctx.request.body;

    if (!number || !message) {
      return ctx.badRequest('Missing number or message');
    }

    try {
      const formData = new URLSearchParams();
      formData.append('api_key', process.env.SMS_API_KEY);  
      formData.append('route', '1');
      formData.append('number', number);
      formData.append('message', message);

      const response = await fetch('https://www.wpsenders.in/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),  // toString() here is fine
      });

      if (!response.ok) {
        const errorText = await response.text();
        return ctx.badRequest(`Failed sending message: ${errorText}`);
      }

      const data = await response.json();

      if (!data.status) {
        return ctx.badRequest(`Failed to send message: ${data.message || 'Unknown error'}`);
      }

      return ctx.send({ status: true, message: 'Message sent successfully' });

    } catch (err) {
      console.error('Error sending WhatsApp message:', err);
      return ctx.internalServerError('Error sending WhatsApp message: ' + err.message);
    }
  },
};
