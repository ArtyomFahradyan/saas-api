import { INVALID, REQUIRED, USER_AUTH } from '../../configs/constants';

export default {
    setReminder: {
        authentication: true,
        authenticationType: USER_AUTH
    },
    dashboard: {
        validation: {
            offset: {
                in: 'query',
                notEmpty: {
                    errorMessage: REQUIRED('Offset')
                },
                isNumeric: {
                    errorMessage: INVALID('Offset')
                }
            }
        },
        authentication: true,
        authenticationType: USER_AUTH
    },
    fiscalYear: {
        validation: {
            fiscalYearStartAt: {
                in: 'body',
                notEmpty: {
                    errorMessage: REQUIRED('Fiscal Year Start')
                },
                isNumeric: {
                    errorMessage: INVALID('Date')
                }
            }
        },
        authentication: true,
        authenticationType: USER_AUTH
    }
};
