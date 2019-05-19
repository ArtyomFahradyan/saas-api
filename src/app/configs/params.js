import {
    apiUrl,
    appUrl,
    apiPort,
    userTokenSecret,
    adminTokenSecret,
    sendGridApiKey,
    emailFrom,
    emailVerificationTemplateId,
    awsAccessKeyId,
    awsSecretAccessKey,
    s3Bucket
} from '../helpers/config';

const params = {
    development: {
        apiUrl,
        appUrl,
        apiPort,
        userTokenSecret,
        adminTokenSecret,
        sendGridApiKey,
        emailFrom,
        emailVerificationTemplateId,
        awsAccessKeyId,
        awsSecretAccessKey,
        s3Bucket
    },
    production: {
        apiUrl,
        appUrl,
        apiPort,
        userTokenSecret,
        adminTokenSecret,
        sendGridApiKey,
        emailFrom,
        emailVerificationTemplateId,
        awsAccessKeyId,
        awsSecretAccessKey,
        s3Bucket
    }
};

export default params[process.env.NODE_ENV || 'development'];
