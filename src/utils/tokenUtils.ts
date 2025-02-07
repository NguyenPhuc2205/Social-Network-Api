export const formatTokenMessage = (message: string, tokenType: string) => {
  return message.replace('{token_type}', tokenType)
}
