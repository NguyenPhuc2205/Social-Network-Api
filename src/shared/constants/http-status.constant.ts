/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-12 16:52:32
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 00:11:48
 * @FilePath      : /server/src/shared/constants/http-status.constant.ts
 * @Description   : HTTP status codes constants
 */
import { StatusCodes } from 'http-status-codes'

const EARLY_HINTS: number = 103
const ALREADY_REPORTED: number = 208
const IM_USED: number = 226
const TOO_EARLY: number = 425

export const HTTP_STATUS = Object.freeze({
  /**
   * 1xx Informational responses (100–199)
   */
  /** 100 - The server has received the request headers and the client should proceed to send the request body. */
  CONTINUE: StatusCodes.CONTINUE,

  /** 101 - The requester has asked the server to switch protocols and the server has agreed to do so. */
  SWITCHING_PROTOCOLS: StatusCodes.SWITCHING_PROTOCOLS,

  /** 102 - The server has received and is processing the request, but no response is available yet. */
  PROCESSING: StatusCodes.PROCESSING,

  /** 103 - The server is likely to send a final response with the header fields included in the informational response. */
  EARLY_HINTS: EARLY_HINTS,

  /**
   * 2XX Successful responses (200–299)
   */
  /** 200 - The request was successful. */
  OK: StatusCodes.OK,

  /** 201 - The request was successful and a resource was created. */
  CREATED: StatusCodes.CREATED,

  /** 202 - The request has been accepted for processing, but the processing is not complete. */
  ACCEPTED: StatusCodes.ACCEPTED,

  /** 203 - The server successfully processed the request, but is returning information from another source. */
  NON_AUTHORITATIVE_INFORMATION: StatusCodes.NON_AUTHORITATIVE_INFORMATION,

  /** 204 - The server successfully processed the request, but is not returning any content. */
  NO_CONTENT: StatusCodes.NO_CONTENT,

  /** 205 - The server successfully processed the request, but requires the requester to reset the document view. */
  RESET_CONTENT: StatusCodes.RESET_CONTENT,

  /** 206 - The server is delivering only part of the resource due to a range header sent by the client. */
  PARTIAL_CONTENT: StatusCodes.PARTIAL_CONTENT,

  /** 207 - The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made. */
  MULTI_STATUS: StatusCodes.MULTI_STATUS,

  /** 208 - The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again. */
  ALREADY_REPORTED: ALREADY_REPORTED,

  /** 226 - The server has completed the request for the resource, and the response is a representation of the result of one. */
  IM_USED: IM_USED,

  /**
   * 3xx Redirection messages (300–399)
   */
  /** 300 - The request has more than one possible response. */
  MULTIPLE_CHOICES: StatusCodes.MULTIPLE_CHOICES,

  /** 301 - The URL of the requested resource has been changed permanently. */
  MOVED_PERMANENTLY: StatusCodes.MOVED_PERMANENTLY,

  /** 302 - The resource is temporarily under a different URL. */
  FOUND: StatusCodes.MOVED_TEMPORARILY,

  /** 303 - The response can be found under another URL using a GET method. */
  SEE_OTHER: StatusCodes.SEE_OTHER,

  /** 304 - The resource has not been modified since the version specified by the request headers. */
  NOT_MODIFIED: StatusCodes.NOT_MODIFIED,

  /** 307 - The resource is temporarily under a different URL, but the client should use the original URL for future requests. */
  TEMPORARY_REDIRECT: StatusCodes.TEMPORARY_REDIRECT,

  /** 308 - The resource is permanently under a different URL. */
  PERMANENT_REDIRECT: StatusCodes.PERMANENT_REDIRECT,

  /**
   * 4xx Client error responses (400–499)
   */
  /** 400 - The server could not understand the request due to invalid syntax. */
  BAD_REQUEST: StatusCodes.BAD_REQUEST,

  /** 401 - The client must authenticate itself to get the requested response. */
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,

  /** 402 - Reserved for future use. */
  PAYMENT_REQUIRED: StatusCodes.PAYMENT_REQUIRED,

  /** 403 - The client does not have access rights to the content. */
  FORBIDDEN: StatusCodes.FORBIDDEN,
  
  /** 404 - The server can not find the requested resource. */
  NOT_FOUND: StatusCodes.NOT_FOUND,

  /** 405 - The request method is known by the server but is not supported by the target resource. */
  METHOD_NOT_ALLOWED: StatusCodes.METHOD_NOT_ALLOWED,

  /** 406 - The server cannot produce a response matching the list of acceptable values defined in the request's headers. */
  NOT_ACCEPTABLE: StatusCodes.NOT_ACCEPTABLE,

  /** 407 - The client must authenticate itself with a proxy. */
  PROXY_AUTHENTICATION_REQUIRED: StatusCodes.PROXY_AUTHENTICATION_REQUIRED,

  /** 408 - The server did not receive a complete request message within the time it was prepared to wait. */
  REQUEST_TIMEOUT: StatusCodes.REQUEST_TIMEOUT,

  /** 409 - The request conflicts with the current state of the server. */
  CONFLICT: StatusCodes.CONFLICT,

  /** 410 - The requested resource is no longer available and will not be available again. */
  GONE: StatusCodes.GONE,

  /** 411 - The server refuses to accept the request without a defined Content-Length header. */
  LENGTH_REQUIRED: StatusCodes.LENGTH_REQUIRED,

  /** 412 - The server does not meet one of the preconditions specified in the request headers. */
  PRECONDITION_FAILED: StatusCodes.PRECONDITION_FAILED,

  /** 413 - The request entity is larger than the server is willing or able to process. */
  PAYLOAD_TOO_LARGE: StatusCodes.REQUEST_TOO_LONG,

  /** 414 - The URI requested by the client is longer than the server is willing to interpret. */
  URI_TOO_LONG: StatusCodes.REQUEST_URI_TOO_LONG,

  /** 415 - The media format of the requested data is not supported by the server. */
  UNSUPPORTED_MEDIA_TYPE: StatusCodes.UNSUPPORTED_MEDIA_TYPE,

  /** 416 - The range specified by the Range header field in the request cannot be fulfilled. */
  RANGE_NOT_SATISFIABLE: StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE,

  /** 417 - The server cannot meet the requirements of the Expect request-header field. */
  EXPECTATION_FAILED: StatusCodes.EXPECTATION_FAILED,

  /** 418 - The server refuses to brew coffee because it is a teapot. */
  IM_A_TEAPOT: StatusCodes.IM_A_TEAPOT,

  /** 421 - The request was directed at a server that is not able to produce a response. */
  MISDIRECTED_REQUEST: StatusCodes.MISDIRECTED_REQUEST,

  /** 422 - The server understands the content type of the request entity, but was unable to process the contained instructions. */
  UNPROCESSABLE_ENTITY: StatusCodes.UNPROCESSABLE_ENTITY,

  /** 423 - The resource that is being accessed is locked. */
  LOCKED: StatusCodes.LOCKED,

  /** 424 - The request failed due to failure of a previous request. */
  FAILED_DEPENDENCY: StatusCodes.FAILED_DEPENDENCY,

  /** 425 - The server is unwilling to risk processing a request that might be replayed. */
  TOO_EARLY: TOO_EARLY,

  /** 426 - The client should switch to a different protocol. */
  UPGRADE_REQUIRED: StatusCodes.UPGRADE_REQUIRED,

  /** 428 - The server requires the request to be conditional. */
  PRECONDITION_REQUIRED: StatusCodes.PRECONDITION_REQUIRED,

  /** 429 - The client has sent too many requests in a given amount of time. */
  TOO_MANY_REQUESTS: StatusCodes.TOO_MANY_REQUESTS,

  /** 431 - The server is unwilling to process the request because its header fields are too large. */
  REQUEST_HEADER_FIELDS_TOO_LARGE: StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE,

  /** 451 - The client requested a resource that is not available due to legal reasons. */
  UNAVAILABLE_FOR_LEGAL_REASONS: StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS,

  /**
   * 5xx Server error responses (500–599)
   */
  /** 500 - The server encountered an unexpected condition that prevented it from fulfilling the request. */
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,

  /** 501 - The server does not support the functionality required to fulfill the request. */
  NOT_IMPLEMENTED: StatusCodes.NOT_IMPLEMENTED,

  /** 502 - The server received an invalid response from the upstream server. */
  BAD_GATEWAY: StatusCodes.BAD_GATEWAY,

  /** 503 - The server is not ready to handle the request. */
  SERVICE_UNAVAILABLE: StatusCodes.SERVICE_UNAVAILABLE,

  /** 504 - The server did not receive a timely response from the upstream server. */
  GATEWAY_TIMEOUT: StatusCodes.GATEWAY_TIMEOUT,

  /** 505 - The server does not support the HTTP protocol version used in the request. */
  HTTP_VERSION_NOT_SUPPORTED: StatusCodes.HTTP_VERSION_NOT_SUPPORTED,

  /** 507 - The server is unable to store the representation needed to complete the request. */
  INSUFFICIENT_STORAGE: StatusCodes.INSUFFICIENT_STORAGE,

  /** 511 - The client needs to authenticate to gain network access. */
  NETWORK_AUTHENTICATION_REQUIRED: StatusCodes.NETWORK_AUTHENTICATION_REQUIRED
} as const)

