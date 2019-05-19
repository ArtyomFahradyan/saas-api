import { CronJob } from 'cron';
import { CRONTIME2, CRONTIMEZONE } from '../configs/constants';
import { CronService } from '../services';

export default new CronJob({
    cronTime: CRONTIME2,
    onTick: async () => {
        try {
            await CronService.sendByReminder(2);
        } catch(e) {
            console.log(e);
        }
    },
    timeZone: CRONTIMEZONE,
    start: false,
});
