import FormField from './FormField.jsx'

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}) {
  return (
    <FormField id={id} label={label} error={error}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-black
          focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? 'border-red-700' : 'border-gray-300'}`}
        aria-invalid={error ? 'true' : 'false'}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}