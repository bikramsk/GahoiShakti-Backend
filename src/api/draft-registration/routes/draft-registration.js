'use strict';

module.exports = {
  routes: [
    // Default routes
    {
      method: 'GET',
      path: '/draft-registrations',
      handler: 'draft-registration.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/draft-registrations/:id',
      handler: 'draft-registration.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/draft-registrations',
      handler: 'draft-registration.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/draft-registrations/:id',
      handler: 'draft-registration.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Custom routes
    {
      method: 'GET',
      path: '/draft-registrations/mobile/:mobileNumber',
      handler: 'draft-registration.findByMobile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/draft-registrations/mobile/:mobileNumber',
      handler: 'draft-registration.saveOrUpdate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/draft-registrations/mobile/:mobileNumber',
      handler: 'draft-registration.deleteDraft',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 