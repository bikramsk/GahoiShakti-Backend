'use strict';

module.exports = ({ strapi }) => ({
  async send(ctx) {
    try {
      let { message, number } = ctx.request.body;

     
      let cleanedNumber = number.toString().replace(/\D/g, '');

   
      if (cleanedNumber.length > 10) {
        cleanedNumber = cleanedNumber.slice(-10);
      }

      const formData = new URLSearchParams();
      formData.append('api_key', process.env.SMS_API_KEY);
      formData.append('message', message);
      formData.append('number', cleanedNumber); 
      formData.append('route', '1');

      const response = await fetch('https://www.wpsenders.in/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      ctx.body = data;
    } catch (error) {
      ctx.body = { error: error.message };
      ctx.status = 500;
    }
  },
});
