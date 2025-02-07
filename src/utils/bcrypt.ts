import bcrypt from 'bcrypt'
export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  } catch (error) {
    throw new Error('Failed to hash password')
  }
}
export const comparePassword = async (userPassword: string, hashPassword: string) => {
  try {
    return await bcrypt.compare(userPassword, hashPassword)
  } catch (error) {
    throw new Error('Failed to compare passwords')
  }
}
