module.exports = ({ env }) => ({
 url: env('PUBLIC_URL', 'https://admin.gahoishakti.in'), 
 host: '0.0.0.0', 
 port: env.int('PORT', 1340),
 app: {
   keys: env.array('APP_KEYS'),
 },
 admin: {
   url: '/admin', 
   serveAdminPanel: true,   
 },
});


//  module.exports = ({ env }) => ({
//    url: env('NODE_ENV') === 'development' 
//     ? 'http://localhost:1340'
//     : 'https://admin.gahoishakti.in',
//    host: '0.0.0.0', 
//   port: env.int('PORT', 1340),
//  app: {
//      keys: env.array('APP_KEYS'),
//   },
//   admin: {
//     url: '/admin', 
//     serveAdminPanel: true,
//    },
// });




