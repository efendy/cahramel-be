module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-do",
      providerOptions: {
        key: env('DO_SPACE_ACCESS_KEY'),
        secret: env('DO_SPACE_SECRET_KEY'),
        endpoint: env('DO_SPACE_ENDPOINT'),
        space: env('DO_SPACE_BUCKET'),
      },
    },
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLYTO'),
      },
    },
  },
});
