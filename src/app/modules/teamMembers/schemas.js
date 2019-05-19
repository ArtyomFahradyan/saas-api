import { INVALID, REQUIRED, USER_AUTH } from '../../configs/constants';

export default {
    addTeamMember: {
        validation: {
            firstName: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('First Name')
                }
            },
            lastName: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Last Name')
                }
            },
            email: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isEmail: {
                    errorMessage: INVALID('Email')
                }
            }
        },
        authentication: true,
        authenticationType: USER_AUTH
    },
    getAllByAccount: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    getOne: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    delete: {
        authentication: true,
        authenticationType: USER_AUTH
    }
};
