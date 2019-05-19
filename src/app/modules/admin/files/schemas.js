import { ADMIN_AUTH, REQUIRED } from '../../../configs/constants';

export default {
    adminAuth: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    download: {
        // authentication: true,
        // authenticationType: ADMIN_AUTH
    },
    rename: {
        validation: {
            alias: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Alias')
                }
            }
        },
        authentication: true,
        authenticationType: ADMIN_AUTH
    }
};

