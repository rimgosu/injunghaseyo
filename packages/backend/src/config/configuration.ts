export default () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    scope: process.env.GOOGLE_SCOPE?.split(',') || [],
  },
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID,
    callback: process.env.KAKAO_CALLBACK_URL,
  },
});
