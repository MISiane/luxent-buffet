import { formatPeso } from '../utils/formatCurrency.js'
import { ADULT_PRICE, KID_PRICE } from '../utils/validators.js'

export default function LiveTotal({ adults, kids, total }) {
  return (
    <div className="rounded-md bg-gray-50 border border-gray-200 p-4">
      <div className="flex items-center justify-between text-sm text-black">
        <span>
          Adults × {adults}{' '}
          <span className="text-gray-500">({formatPeso(ADULT_PRICE)} each)</span>
        </span>
        <span>{formatPeso(Number(adults) * ADULT_PRICE)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-black">
        <span>
          Kids × {kids}{' '}
          <span className="text-gray-500">({formatPeso(KID_PRICE)} each)</span>
        </span>
        <span>{formatPeso(Number(kids) * KID_PRICE)}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-black">Estimated Total</span>
        <span className="text-lg font-semibold text-black">{formatPeso(total)}</span>
      </div>
    </div>
  )
}