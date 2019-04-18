import {ADMIN_AUTH, REQUIRED} from '../../../configs/constants';

export default {
    getTeams: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    addTeam: {
        validation: {
            account: {
                notEmpty: {
                    errorMessage: REQUIRED('Account')
                }
            },
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

