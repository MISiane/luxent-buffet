export const ADULT_PRICE = 1999
export const KID_PRICE = 999

export function computeTotal({ adults, kids }) {
  return adults * ADULT_PRICE + kids * KID_PRICE
}