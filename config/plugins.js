//  module.exports = () => ({
//   upload: {
//     config: {
//       provider: 'local',
//       providerOptions: {
//         sizeLimit: 10000000,
//       },
//       actionOptions: {
//         upload: {
//           optimize: false, //  Turn off auto-optimization
//         },
//       },
//     },
//   },
// });


module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});


