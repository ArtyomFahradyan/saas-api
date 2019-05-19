import { NO_CONTENT_CODE, SUCCESS_CODE } from '../../../configs/status-codes';
import { NotificationService } from '../../../services';
import Handlers from '../../../helpers/handlers';
import { NotFound } from '../../../errors';
import { NOT_EXISTS } from '../../../configs/constants';
import { io } from '../../../../server';

export class NotificationController {
    static async getAll(req, res, next) {
        const query = req.query;
        try {
            const proxy = new Proxy(query, Handlers.queryHandler());

            const notifications = await NotificationService.getAll(proxy);

            return res.status(SUCCESS_CODE).json(notifications);
        } catch (err) {
            next(err);
        }
    }

    static async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const notification = await NotificationService.getOne(id);

            const seenNotification = await NotificationService.update(notification._id, {
                seen: true
            });

            return res.status(SUCCESS_CODE).json(seenNotification);
        } catch (err) {
            next(err);
        }
    }

    static async setAsSeen(req, res, next) {
        const { id } = req.params;
        try {
            const notification = await NotificationService.getById(id);

            if (!notification) {
                throw new NotFound(NOT_EXISTS('Notification'));
            }

            const attributes = { seen: true };
            let updatedNotification = await NotificationService.update(notification._id, attributes);

            io.emit('SET_AS_SEEN', {
                message: 'Marked as seen'
            });

            return res.status(SUCCESS_CODE).json(updatedNotification);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const { id } = req.params;
        try {
            const notification = await NotificationService.getById(id);

            if (!notification) {
                throw new NotFound(NOT_EXISTS('Notification'));
            }

            await NotificationService.delete(notification._id);

            return res.status(NO_CONTENT_CODE).json({ success: true });
        } catch (err) {
            next(err);
        }
    }
}
