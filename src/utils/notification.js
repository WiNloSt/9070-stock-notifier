const { LINE_GROUP, CHANNEL_ACCESS_TOKEN } = process.env

/**
 *
 * @param {string} message
 */
export function sendNotification(message) {
  fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    body: JSON.stringify({
      to: LINE_GROUP,
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
    .then((res) => res.json())
    .then((response) => {
      console.log(response)
    })
}
