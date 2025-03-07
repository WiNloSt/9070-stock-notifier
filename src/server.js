import "./setupDevEnv.js";
import { CronJob } from "cron";

/**
 * @returns {string}
 */
function currentDate() {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "long",
    timeZone: "Asia/Bangkok",
  }).format();
}

const job = CronJob.from({
  cronTime: "0 */5 * * * *",
  onTick: function () {
    console.log(`${currentDate()}: every 5 minutes`);
  },
  start: true,
  timeZone: "Asia/Bangkok",
});

job.start();
