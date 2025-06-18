/*
 * @Author        : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @Date          : 2025-02-24 10:13:23
 * @LastEditors   : Phuc Nguyen nguyenhuuphuc22052004@gmail.com
 * @LastEditTime  : 2025-05-24 10:13:23
 * @FilePath      : /server/src/common/helpers/stackTrace.ts
 * @Description   : Helper function to get the caller location in the stack trace
 */

export const getCallerLocation = (depth = 2): string => {
  const stack = new Error().stack?.split('\n') || []
  if (!stack || stack.length <= depth) {
    return 'unknown location'
  }

  const callerLine = stack[depth].trim()
  const match = callerLine.match(/at (.+) \((.+):(\d+):(\d+)\)/) || callerLine.match(/at (.+):(\d+):(\d+)/)

  if (match) {
    const [_, functionName, filePath, lineNumber, columnNumber] = match
    return `${functionName} (${filePath}:${lineNumber}:${columnNumber})`
  }

  return callerLine
}
