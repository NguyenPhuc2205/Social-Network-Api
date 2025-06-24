/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-06-20 23:49:50
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-06-21 00:03:23
 * @FilePath      : /server/src/shared/enums/mime.enum.ts
 * @Description   : MIME (Multipurpose Internet Mail Extensions) types
 */

// Determines the type of content being sent over the internet 
// Use in HTTP headers, file uploads, and more

export enum ImageMime {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',
  TIFF = 'image/tiff',
  ICO = 'image/x-icon',
}

export enum VideoMime {
  MP4 = 'video/mp4',
  MPEG = 'video/mpeg',
  MOV = 'video/quicktime',
  WEBM = 'video/webm',
  OGG = 'video/ogg',
  AVI = 'video/x-msvideo',
  MKV = 'video/x-matroska',
  FLV = 'video/x-flv',
}

export enum AudioMime {
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',
  FLAC = 'audio/flac',
  AAC = 'audio/aac',
  M4A = 'audio/mp4',
  WMA = 'audio/x-ms-wma',
}

export enum DocumentMime {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT = 'text/plain',
  CSV = 'text/csv',
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
}
