import {
    apiUrl,
    appUrl,
    apiPort,
    userTokenSecret,
    adminTokenSecret,
    sendGridApiKey,
    emailFrom

} from '../helpers/config';

const params = {
    development: {
        apiUrl,
        appUrl,
        apiPort,
        userTokenSecret,
        adminTokenSecret,
        sendGridApiKey,
        emailFrom
    },
    production: {
        apiUrl,
        appUrl,
        apiPort,
        userTokenSecret,
        adminTokenSecret,
        sendGridApiKey,
        emailFrom
    }
};

export default params[process.env.NODE_ENV || 'development'];
