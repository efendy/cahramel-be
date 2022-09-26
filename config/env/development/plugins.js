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
      provider: 'sendmail',
      providerOptions: {
        dkim: {
          privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQDv5d/xrHIMaCWbCjD92as5IL/i2IiKhek89PzlhsM/nqxkMVIg\nV1Gw8G6wI+w08MxF339KAJjj6uDyDLcrpTyIO1zUAjzQdBqxQcwEzK3VsSKxlF/3\npXhEA4V67tADdbvIsbBqyw74lJykBYJZNkPkx0xI50yj1c6D3Hinr+uRXwIDAQAB\nAoGAJZQiwl669sqRqXmtNvaT5b0FkelNajWT1aKiwumbSCn44zD+pmZHO6pODHV0\nGM7nkMJz1AnH6VvvpLrtLn8Rvg+3xTNMZSjh+N6VbZpAdj6BeDN2q3sVKGAdnr+B\nE+5esUgg3kh4mQ3h2TzF4yHC4vtWtTKFZ/Sr8eahRHS1iaECQQD8F4FimsWSLV+E\nw3tYwRriAElnJ3bdW3vDdGA1eCTYZPqQRqM+99q+N7ZaEGaHZclPLFoUFvKO48tB\nTnJ6EjyZAkEA8535heiNUcPH7KetnncQ6pJnp5aXLlY/9ucW59ReGs4PpMaiKJ7u\n/pHWHS2fs9q/TDGsqYzou/je8cQKRRxAtwJBAMFui9IMblMmy6dEk+3bZnRJwgkL\n6BIb81BbiMMeaC8+9GAmQ3a6mjbg6uQat4FnIdvFbW0C2qW3tqtqtT5jpekCQG69\njfK4Hp1fcN777elN2Iu415OP2dM/c74pl/j0SX7H0salYIs0jBF+e6Ux2xnnwvPA\n1OsR2a2w2K9v3PdDe4sCQAecvLzNSgwemTSQDlhOJAaNmmHrDoYY/fPodeSMofYn\nAIxHIiMoGk55A9UGiREm8XMDDD/SXucr7uF2zP6vavY=\n-----END RSA PRIVATE KEY-----',
          keySelector: 'cahramel._domainKey',
        },
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLYTO'),
      },
    }
  },
});
