/**
 * Possible sources of request data in Express & Validate with Zod.
 * 
 * @typedef {('body'|'headers'|'query'|'params'|'cookies')} RequestSource
 * @description
 * Represents the different locations where data can be found in an Express request object.
 * This is used to specify which part of the request should be validated.
 */
export type RequestSource = 'body' | 'headers' | 'query' | 'params' | 'cookies' | 'files'

export type ErrorSeverity = 'high' | 'medium' | 'low'
