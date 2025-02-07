import fs from 'fs'
import path from 'path'
import winston, { Logform } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const { combine, timestamp, colorize, printf, align, label } = winston.format

const logDir = path.resolve(process.cwd(), 'logs')

// Ensures that the logs directory exists. If not, it creates one.
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

/**
 * Defines the format for log messages.
 * The format includes a timestamp, label, log level, and message.
 *
 * @constant
 * @type {Logform.Format}
 */
const logFormat: Logform.Format = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label ?? 'app'}] ${level}: ${message}`
})

/**
 * Creates a Winston logger instance for application-wide logging.
 *
 * - Logs messages to rotating log files in the "logs" directory.
 * - Outputs logs to the console in non-production environments.
 * - Supports log levels: error, warn, info, http, verbose, debug, silly.
 *
 * @constant
 * @type {winston.Logger}
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',

  // Formatting for log messages
  format: combine(
    label({ label: 'application' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS A'
    }),
    align(),
    logFormat
  ),

  // Log output destinations (transports)
  transports: [
    /**
     * Stores logs in rotating files.
     * - Each file is named `application-YYYY-MM-DD.log`
     * - Compresses old logs (`zippedArchive: true`)
     * - Keeps logs for 30 days
     * - Max file size: 20MB
     */
    new DailyRotateFile({
      dirname: logDir,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
})

/**
 * Adds a console transport when not in production.
 *
 * - Logs messages with colorized output.
 * - Uses the same format as file logs.
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat)
    })
  )
}
