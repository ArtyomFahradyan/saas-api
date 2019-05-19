import { CronJob } from 'cron';
import { CRONTIME3, CRONTIMEZONE } from '../configs/constants';
import { CronService } from '../services';

export default new CronJob({
    cronTime: CRONTIME3,
    onTick: async () => {
        try {
            await CronService.sendByReminder(3);
        } catch(e) {
            console.log(e);
        }
    },
    timeZone: CRONTIMEZONE,
    start: false,
});
