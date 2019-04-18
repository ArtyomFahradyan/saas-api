import { ADMIN_AUTH, REQUIRED } from '../../../configs/constants';

export default {
    getPlatforms: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    addPlatform: {
        validation: {
            name: {
                notEmpty: {
                    errorMessage: REQUIRED('Team name')
                }
            }
        },
        authentication: true,
        authenticationType: ADMIN_AUTH
    }
};

