/**
 * Generates a cryptographically random password using the Web Crypto API.
 * Default length 14 — long enough that bcrypt brute-force is impractical,
 * short enough that the admin can read/copy it.
 *
 * Character set excludes visually ambiguous characters (0/O, l/1) to make
 * it copy-paste-safe.
 */
const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*'

export function generatePassword(length = 14): string {
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, (n) => ALPHABET[n % ALPHABET.length]).join('')
}
