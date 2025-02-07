export const getEnvString = (key: string, defaultValue: string = '') => {
  return process.env[key]?.trim() || defaultValue
}

export const getEnvNumber = (key: string, defaultValue: number = 0) => {
  try {
    const value = Number(process.env[key])
    return isNaN(value) ? defaultValue : value
  } catch (error) {
    throw Error()
  }
}

export const getEnvBoolean = (key: string, defaultValue: boolean = false) => {
  return process.env[key]?.trim()?.toLowerCase() === 'true'
}
