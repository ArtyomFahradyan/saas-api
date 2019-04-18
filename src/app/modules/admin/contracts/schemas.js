import { ADMIN_AUTH, INVALID, REQUIRED } from '../../../configs/constants';

export default {
    addContract: {
        validation: {
            account: {
                notEmpty: {
                    errorMessage: REQUIRED('Account')
                }
            },
            platform: {
                notEmpty: {
                    errorMessage: REQUIRED('Platform')
                }
            },
            team: {
                notEmpty: {
                    errorMessage: REQUIRED('Team')
                }
            },
            startedAt: {
                notEmpty: {
                    errorMessage: REQUIRED('Platform')
                },
                isValidDate: {
                    errorMessage: INVALID('Date')
                }
            },
            price: {
                notEmpty: {
                    errorMessage: REQUIRED('Price')
                }
            },
        },
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    editContact: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    getOne: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    deleteContract: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    },
    getByAccount: {
        authentication: true,
        authenticationType: ADMIN_AUTH
    }
};

