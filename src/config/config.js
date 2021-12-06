const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    POSTGRESQL_HOSTNAME: Joi.string().required().description('POSTGRESQL host'),
    POSTGRESQL_USERNAME: Joi.string().required().description('POSTGRESQL username'),
    POSTGRESQL_PASSWORD: Joi.string().required().description('POSTGRESQL pass'),
    POSTGRESQL_PORT: Joi.string().required().description('POSTGRESQL port'),
    POSTGRESQL_DB: Joi.string().required().description('POSTGRESQL Database'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_DAY: Joi.number().default(1).description('day after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    AWS_ACCESS_KEY_ID: Joi.string().description('AWS access key id'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS secret access key'),
    AWS_S3_BUCKET_NAME: Joi.string().description('AWS S3 bucket name'),
    AWS_S3_ENV: Joi.string().description('AWS S3 environment'),
    AWS_REGION: Joi.string().description('AWS region'),
    LOCATION_RATE: Joi.number().description('Location rate'),
    REANTAL_PRICE_RATE: Joi.number().description('Price rate'),
    LOCATION_MAX: Joi.number().description('Location rate'),
    REANTAL_PRICE_MAX: Joi.number().description('Price rate'),
    TOTAL_PERCENT: Joi.number().description('Total percent'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  poolPostGre: {
    user: envVars.POSTGRESQL_USERNAME,
    host: envVars.POSTGRESQL_HOSTNAME,
    database: envVars.POSTGRESQL_DB,
    password: envVars.POSTGRESQL_PASSWORD,
    port: envVars.POSTGRESQL_PORT,
    ssl: envVars.POSTGRESQL_SSL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDay: envVars.JWT_ACCESS_EXPIRATION_DAY,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  S3: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    bucketName: envVars.AWS_S3_BUCKET_NAME,
    env: envVars.AWS_S3_ENV,
    region: envVars.AWS_REGION,
  },
  matching_room: {
    distance_rate: envVars.LOCATION_RATE,
    price_rate: envVars.REANTAL_PRICE_RATE,
    distance_max: envVars.LOCATION_MAX,
    price_max: envVars.REANTAL_PRICE_MAX,
    total_percent: envVars.TOTAL_PERCENT,
  },
};
