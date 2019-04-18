import {INVALID, REQUIRED, USER_AUTH} from '../../configs/constants';

export default {
    signup: {
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
            company: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Company')
                }
            },
            team: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Team')
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
            },
            password: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Password')
                }
            }
        }
    },
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
    logout: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    resetPasswordCheckEmail: {
        validation: {
            email: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Email')
                },
                isEmail: {
                    errorMessage: INVALID('Email')
                }
            }
        }
    },
    resetPassword: {
        validation: {
            password: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Password')
                }
            }
        }
    }
};

