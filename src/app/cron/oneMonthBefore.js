import { CronJob } from 'cron';
import { CRONTIME1, CRONTIMEZONE } from '../configs/constants';
import { CronService } from '../services';

export default new CronJob({
    cronTime: CRONTIME1,
    onTick: async () => {
        try {
            await CronService.sendByReminder(1);

        } catch(e) {
            console.log(e);
        }
    },
    timeZone: CRONTIMEZONE,
    start: false,
});
