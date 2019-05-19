import { INVALID, REQUIRED, USER_AUTH } from '../../configs/constants';

export default {
    getByAccount: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    addTeam: {
        validation: {
            name: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Team name')
                }
            }
        },
        authentication: true,
        authenticationType: USER_AUTH
    },
    delete: {
        authentication: true,
        authenticationType: USER_AUTH
    }
};
