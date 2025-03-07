import nodeFetch from 'node-fetch'
import crypto from 'crypto'

const API_KEY = process.env.API_KEY
const HEADERS = { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
const API_URL = 'https://api.transferwise.com'
const PROFILE_ID = process.env.PROFILE_ID
const BALANCES = JSON.parse(process.env.BALANCES || '{}')

/**
 * @typedef {'usd' | 'saving' | 'insurance' | 'car_insurance' | 'tax' | 'child' | 'travel' | 'living_expense' | 'house'} Balance
 */

/**
 * @type {Record<Balance, number>}
 */
const BALANCES_BUDGET = {
  usd: 0,
  saving: 0,
  insurance: 260,
  car_insurance: 30,
  tax: 100,
  child: 300,
  travel: 50,
  living_expense: 400,
  house: 300,
}

const Api = {
  listProfiles() {
    console.log({ HEADERS })
    return fetch('/v2/profiles', { headers: HEADERS })
  },
  listBalances() {
    return fetch(`/v4/profiles/${PROFILE_ID}/balances?types=STANDARD`, {
      headers: HEADERS,
    })
  },
  listJars() {
    return fetch(`/v4/profiles/${PROFILE_ID}/balances?types=SAVINGS`, {
      headers: HEADERS,
    })
  },
  /**
   * @param {Balance} jar
   * @returns
   */
  addBalanceToJar(jar) {
    if (!jar) {
      throw new Error('Jar is required')
    }
    const body = JSON.stringify({
      amount: {
        value: BALANCES_BUDGET[jar],
        currency: 'USD',
      },
      sourceBalanceId: BALANCES.usd,
      targetBalanceId: BALANCES[jar],
    })
    return fetch(`/v2/profiles/${PROFILE_ID}/balance-movements`, {
      method: 'POST',
      headers: { ...HEADERS, 'X-idempotence-uuid': crypto.randomUUID() },
      body: body,
    })
  },
  automateBudgets() {
    /**
     * @type {Balance[]}
     */
    const budgetedBalances = [
      'insurance',
      'car_insurance',
      'tax',
      'child',
      'travel',
      'living_expense',
      'house',
    ]
    return Promise.all(
      budgetedBalances.map((jar) => Api.addBalanceToJar(jar).then((response) => response.json()))
    )
  },
}

export default Api

/**
 * @type {typeof nodeFetch}
 */
const fetch = (url, options) => {
  return nodeFetch(`${API_URL}${url}`, options)
}
