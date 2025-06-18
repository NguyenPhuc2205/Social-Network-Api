export const calculateAge = (birthDate: Date): number => {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    throw new Error('Invalid date provided')
  }

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export const isValidAge = (birthDate: Date): boolean => {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) return false

  const today = new Date()

  let age: number = today.getFullYear() - birthDate.getFullYear()

  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= 13 && age <= 120
}
