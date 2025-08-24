'use strict';

/**
 * people-search router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/people-search',
      handler: 'people-search.search',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
