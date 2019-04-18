import User from './user';
import Admin from './admin';
import Account from './account';
import Contract from './contract';
import Filesystem from './filesystem';
import Token from './token';
import Team from './team';
import Platform from './platform';
import Notification from './notification';

export default function initModels(mongoose) {
    User(mongoose);
    Admin(mongoose);
    Contract(mongoose);
    Account(mongoose);
    Token(mongoose);
    Filesystem(mongoose);
    Team(mongoose);
    Platform(mongoose);
    Notification(mongoose);
}
