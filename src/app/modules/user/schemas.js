import { INVALID, REQUIRED, USER_AUTH } from '../../configs/constants';

export default {
    me: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    changePassword: {
        validation: {
            oldPassword: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Current Password')
                }
            },
            newPassword: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('New Password')
                }
            }
        },
        authentication: true,
        authenticationType: USER_AUTH
    },
    addUserCheckEmail: {
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
    editUser: {
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
    deleteUser: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    addUser: {
        validation: {
            password: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Password')
                }
            }
        }
    },
    getUsers: {
        authentication: true,
        authenticationType: USER_AUTH
    },
};
