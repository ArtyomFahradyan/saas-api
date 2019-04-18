import { ADMIN_AUTH, REQUIRED, INVALID } from '../../../configs/constants';

export default {
    login: {
        validation: {
            email: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isEmail: {
                    errorMessage: INVALID('Email')
                }
            },
            password: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Password')
                }
            }
        }
    },
    getAdmin: {
        authentication: true,
        authenticationType: ADMIN_AUTH

    },
    logout: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
};

