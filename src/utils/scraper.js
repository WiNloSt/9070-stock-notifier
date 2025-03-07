import * as cheerio from 'cheerio'
import { ADVICE_RESPONSE } from './test-responses.js'

const SEARCH_TERM = '9070'

// Advice
export function scrapeAdvice() {
  return fetch('https://www.advice.co.th/avi/getProduct', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `menu_level=search&menu=${SEARCH_TERM}&skip=0&take=8&key=0&sort_promotion=&product_type=search`,
    method: 'POST',
  })
    .then((res) => res.text())
    .then((res) => JSON.parse(res))
    .then((/** @type {typeof ADVICE_RESPONSE} */ data) => {
      return data.res
        .filter((item) => item.item_name.toLowerCase().includes(SEARCH_TERM))
        .filter(Boolean)
        .map((item) => {
          return `found ${item.item_name} at ${item.item_url}`
        })
    })
}

// JIB
export function scrapeJib() {
  return fetch(
    `https://www.jib.co.th/web/product/product_search/0?str_search=${SEARCH_TERM}&cate_id[]=42`
  )
    .then((res) => res.text())
    .then((res) => {
      const $jib = cheerio.load(res)
      /**
       * @typedef Item
       * @property {string} name
       * @property {string} href
       */

      /**
       * @type {Item[]}
       */
      const items = []
      $jib('#body .panel .panel_body_detail .reladiv > :nth-child(2) > * > a').each((_, el) => {
        const { title, href } = el.attribs
        items.push({
          name: title,
          href,
        })
      })

      return items
        .filter((item) => {
          return item.name.toLowerCase().includes(SEARCH_TERM)
        })
        .map((item) => {
          return `found ${item.name} at ${item.href}`
        })
    })
}
