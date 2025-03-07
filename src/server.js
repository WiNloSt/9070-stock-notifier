import './setupDevEnv.js'
import { CronJob } from 'cron'
import { sendNotification } from './utils/notification.js'
import './utils/scraper.js'
import { scrapeAdvice, scrapeJib } from './utils/scraper.js'

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
    scrapeAdvice()
      .then((items) => {
        const message = items.join('\n')
        if (message) {
          sendNotification(message)
        }
      })
      .catch((error) => {
        console.error('Error while scraping Advice', error)
        sendNotification(`❌ Error while scraping Advice`)
      })
    scrapeJib()
      .then((items) => {
        const message = items.join('\n')
        if (message) {
          sendNotification(message)
        }
      })
      .catch((error) => {
        console.error('Error while scraping JIB', error)
        sendNotification(`❌ Error while scraping JIB`)
      })
  },
  start: true,
  timeZone: 'Asia/Bangkok',
})

job.start()
