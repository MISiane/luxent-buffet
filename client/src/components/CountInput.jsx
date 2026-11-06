import FormField from './FormField.jsx'

export default function CountInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max,
  error,
}) {
  function clamp(n) {
    let v = Number(n)
    if (!Number.isInteger(v)) v = min
    if (v < min) v = min
    if (typeof max === 'number' && v > max) v = max
    return v
  }

  function dec() {
    onChange(clamp(Number(value) - 1))
  }

  function inc() {
    onChange(clamp(Number(value) + 1))
  }

  return (
    <FormField id={id} label={label} error={error}>
      <div
        className={`flex items-stretch w-full h-11 rounded-md border bg-white overflow-hidden
          ${error ? 'border-red-700' : 'border-gray-300'}`}
      >
        <button
          type="button"
          onClick={dec}
          disabled={Number(value) <= min}
          className="flex items-center justify-center w-11 h-full text-xl leading-none font-semibold text-black
            hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-700"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          id={id}
          name={id}
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : clamp(e.target.value))
          }
          className="flex-1 min-w-0 text-center py-0 text-sm text-black bg-transparent
            focus:outline-none
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={inc}
          disabled={typeof max === 'number' && Number(value) >= max}
          className="flex items-center justify-center w-11 h-full text-xl leading-none font-semibold text-black
            hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-700"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </FormField>
  )
}