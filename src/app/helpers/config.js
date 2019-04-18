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
