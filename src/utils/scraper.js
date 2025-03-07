import { ADVICE_RESPONSE } from './test-responses.js'

// Advice
export function scrapeAdvice() {
  return fetch('https://www.advice.co.th/avi/getProduct', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: 'menu_level=search&menu=9070&skip=0&take=8&key=0&sort_promotion=&product_type=search',
    method: 'POST',
  })
    .then((res) => res.text())
    .then((res) => JSON.parse(res))
    .then((/** @type {typeof ADVICE_RESPONSE} */ data) => {
      return data.res
        .map((item) => {
          if (item.item_name.toLowerCase().includes('9070')) {
            return `found a 9070 * at ${item.item_url}`
          }
        })
        .filter(Boolean)
    })
}

// const $advice = cheerio.load(ADVICE_RESPONSE)
// $advice()
