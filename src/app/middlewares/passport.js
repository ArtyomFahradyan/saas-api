const passport = require('passport');

export default (rule) => {
    return passport.authenticate(rule, { session: false });
}
