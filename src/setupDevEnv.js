import dotenv from 'dotenv'

const isDev = process.env.NODE_ENV === 'development'
if (isDev) {
  dotenv.config()
}
