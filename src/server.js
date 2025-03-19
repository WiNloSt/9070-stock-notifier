import './setupDevEnv.js'
import { CronJob } from 'cron'
import { sendNotification } from './utils/notification.js'
import './utils/scraper.js'
import { scrapeAdvice, scrapeHeadDaddy, scrapeJib, SEARCH_TERM } from './utils/scraper.js'

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

const EVERY_X_MINUTES = 2
const job = CronJob.from({
  cronTime: `0 */${EVERY_X_MINUTES} * * * *`,
  onTick: function () {
    console.log(`${currentDate()}: every ${EVERY_X_MINUTES} minutes`)
    scrapeAdvice()
      .then(handleSuccess('advice'))
      .catch(
        handleFailure(
          'Advice',
          `https://www.advice.co.th/search?keyword=${encodeURIComponent(SEARCH_TERM)}`
        )
      )
    scrapeJib()
      .then(handleSuccess('jib'))
      .catch(
        handleFailure(
          'JIB',
          `https://www.jib.co.th/web/product/product_search/0?str_search=${encodeURIComponent(
            SEARCH_TERM
          )}&cate_id%5B%5D=42`
        )
      )
    scrapeHeadDaddy()
      .then(handleSuccess('headDaddy'))
      .catch(handleFailure('HeadDaddy', 'https://www.headdaddy.com/index.php/home/'))
  },
  start: true,
  timeZone: 'Asia/Bangkok',
})

job.start()

/**
 * @type {Record<import('./utils/scraper.js').Site, string>}
 */
const previousSiteMessages = {
  advice: '',
  jib: '',
  headDaddy: '',
}
/**
 *
 * @param {import('./utils/scraper.js').Site} site
 */
function handleSuccess(site) {
  /**
   *
   * @param {string[]} messages
   */
  return function (messages) {
    const previousSiteMessage = previousSiteMessages[site]
    const message = messages.join('\n')
    previousSiteMessages[site] = message
    if (message && message !== previousSiteMessage) {
      return sendNotification(message)
    }
  }
}

/**
 *
 * @param {string} source
 * @param {string} url
 * @returns {(error: Error) => void}
 */
function handleFailure(source, url) {
  return function (error) {
    console.error(`Error while scraping ${source}`, error)
    sendNotification(`❌ Error while scraping ${source}: ${url}`)
  }
}
