const textChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generates a string containing random characters.
 * @param {number} [randomLength=12] - Length of the generated string. Default is 12.
 * @returns {string} - The generated string.
 */
export function randomText(randomLength = 12): string {
  let str = ''
  for (let i = 0; i < randomLength; i++) {
    str += textChars.charAt(Math.floor(Math.random() * textChars.length))
  }

  return str
}
