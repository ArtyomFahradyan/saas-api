if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

import env from 'env-var';

export const mongoUrl = env.get('MONGODB_URI').asString();

export const apiUrl = env.get('API_URL').asString();
export const appUrl = env.get('APP_URL').asString();
export const apiPort = env.get('PORT').asString();

export const userTokenSecret = env.get('USER_TOKEN_SECRET').asString();
export const adminTokenSecret = env.get('ADMIN_TOKEN_SECRET').asString();

export const sendGridApiKey = env.get('SENDGRID_API_KEY').asString();
export const emailFrom = env.get('EMAIL_FROM').asString();
export const emailVerificationTemplateId = env.get('EMAIL_VERIFICATION_TEMPLATE_ID').asString();

export const awsAccessKeyId = env.get('AWS_ACCESS_KEY_ID').asString();
export const awsSecretAccessKey = env.get('AWS_SECRET_ACCESS_KEY').asString();
export const s3Bucket = env.get('S3_BUCKET').asString();