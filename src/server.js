import './setupDevEnv.js'
import { CronJob } from 'cron'
import { sendNotification } from './utils/notification.js'
import './utils/scraper.js'
import { scrapeAdvice } from './utils/scraper.js'

/**
 * @returns {string}
 */
function currentDate() {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    timeStyle: 'long',
    timeZone: 'Asia/Bangkok',
  }).format()
}

const job = CronJob.from({
  cronTime: '0 */5 * * * *',
  onTick: function () {
    console.log(`${currentDate()}: every 5 minutes`)
    scrapeAdvice().then((items) => {
      sendNotification(items.join('\n'))
    })
    sendNotification('test notification')
  },
  start: true,
  timeZone: 'Asia/Bangkok',
})

job.start()
