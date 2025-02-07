import { config } from 'dotenv'
import { google } from 'googleapis'
import { each, forEach } from 'lodash'
import nodemailer, { TransportOptions } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
config()

const stringRedirectUris: string = process.env.GMAIL_OAUTH_REDIRECT_URIS as string
const arrayRedirectUris = stringRedirectUris.split(',')
arrayRedirectUris.forEach((uri, index, array) => {
  array[index] = uri.trim() // Trim và gán lại vào mảng
})

const clientId: string = process.env.GMAIL_OAUTH_CLIENT_ID as string
const clientSecret: string = process.env.GMAIL_OAUTH_CLIENT_SECRET as string

//Create oauth2 Client
const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, arrayRedirectUris[1])

//Generate a url that asks permissions for Gmail scopes
const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
]
const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: GMAIL_SCOPES
})

console.info(`authURL: ${url}`)

import express from 'express'

const app = express()
app.listen(4000, () => {
  console.log('Server is running at http://localhost:4000')
})

app.get('/api/oauth/google', async (req, res) => {
  const code = req.query.code as string
  try {
    const { tokens } = await oAuth2Client.getToken(code)
    console.log(tokens)

    oAuth2Client.setCredentials(tokens)

    // Xử lý tiếp theo (ví dụ: gửi email)
    res.send('Authorization successful! You can close this window.')
  } catch (error) {
    console.error('Error retrieving tokens:', error)
    res.status(500).send('Error retrieving tokens')
  }
})
