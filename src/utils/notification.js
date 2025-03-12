const { LINE_USER, CHANNEL_ACCESS_TOKEN } = process.env

/**
 *
 * @param {string} message
 */
export function sendNotification(message) {
  return fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    body: JSON.stringify({
      to: LINE_USER,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
  })
    .then((res) => Promise.all([res.status, res.json()]))
    .then(([status, response]) => {
      console.log(status, response)
      if (status >= 400) {
        throw new Error('Failed to send notification')
      }
    })
}
