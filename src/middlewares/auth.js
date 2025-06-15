module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      // Check for API token
      const apiToken = ctx.request.header.authorization?.replace('Bearer ', '');
      
      if (apiToken === process.env.STRAPI_API_TOKEN) {
        // API token is valid
        return await next();
      }

      // Check for JWT token
      if (!ctx.state.user) {
        // No user authenticated
        ctx.throw(401, 'Unauthorized');
      }

      await next();
    } catch (error) {
      ctx.throw(401, error.message);
    }
  };
};