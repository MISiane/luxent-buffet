import Logo from '../components/Logo.jsx'
import FormField from '../components/FormField.jsx'
import SelectField from '../components/SelectField.jsx'
import CountInput from '../components/CountInput.jsx'
import LiveTotal from '../components/LiveTotal.jsx'
import ConfirmationMessage from '../components/ConfirmationMessage.jsx'
import { useBuffetDates } from '../hooks/useBuffetDates.js'
import { useReservationForm } from '../hooks/useReservationForm.js'

export default function ReservationPage() {
  const { dates, loading: datesLoading, error: datesError } = useBuffetDates()
  const form = useReservationForm()

  const dateOptions = dates.map((d) => ({ value: d.date, label: d.label }))

  return (
    <main className="holiday-bg min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <header className="mb-8">
          <Logo />
        </header>

        <div className="rounded-lg bg-white shadow-xl p-6 sm:p-8">
          {form.submitted ? (
            <ConfirmationMessage
              reservation={form.submitted}
              onReset={form.reset}
            />
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-semibold text-black text-center">
                Holiday Buffet 2026 Early Booking Reservation
              </h1>
              <p className="mt-3 text-sm text-gray-700 text-center">
                Enter your details and submit to avail of our holiday buffet
                early booking rate, valid until November 30. Prepayment is
                required to confirm your reservation. Our team will contact you
                to arrange payment.
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  form.submit()
                }}
                noValidate
              >
                <FormField
                  id="full_name"
                  label="Name"
                  error={form.errors.full_name}
                >
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    value={form.values.full_name}
                    onChange={(e) => form.setField('full_name', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm text-black
                      focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
                      ${form.errors.full_name ? 'border-red-700' : 'border-gray-300'}`}
                    aria-invalid={form.errors.full_name ? 'true' : 'false'}
                  />
                </FormField>

                <FormField
                  id="contact_number"
                  label="Contact Number"
                  error={form.errors.contact_number}
                >
                  <input
                    id="contact_number"
                    name="contact_number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.values.contact_number}
                    onChange={(e) =>
                      form.setField('contact_number', e.target.value)
                    }
                    placeholder="09xx xxx xxxx"
                    className={`w-full rounded-md border px-3 py-2.5 text-sm text-black
                      focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
                      ${form.errors.contact_number ? 'border-red-700' : 'border-gray-300'}`}
                    aria-invalid={form.errors.contact_number ? 'true' : 'false'}
                  />
                </FormField>

                <FormField
                  id="email"
                  label="Email"
                  error={form.errors.email}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.values.email}
                    onChange={(e) => form.setField('email', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm text-black
                      focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-red-700
                      ${form.errors.email ? 'border-red-700' : 'border-gray-300'}`}
                    aria-invalid={form.errors.email ? 'true' : 'false'}
                  />
                </FormField>

                <SelectField
                  id="buffet_date"
                  label="Date"
                  value={form.values.buffet_date}
                  onChange={(v) => form.setField('buffet_date', v)}
                  options={dateOptions}
                  placeholder={
                    datesLoading
                      ? 'Loading dates…'
                      : datesError
                      ? 'Failed to load dates'
                      : 'Select a date'
                  }
                  disabled={datesLoading || !!datesError}
                  error={form.errors.buffet_date}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CountInput
                    id="adults"
                    label="Number of Adults"
                    value={form.values.adults}
                    onChange={(v) => form.setField('adults', v)}
                    min={1}
                    error={form.errors.adults}
                  />
                  <CountInput
                    id="kids"
                    label="Number of Kids"
                    value={form.values.kids}
                    onChange={(v) => form.setField('kids', v)}
                    min={0}
                    error={form.errors.kids}
                  />
                </div>

                <LiveTotal
                  adults={form.values.adults}
                  kids={form.values.kids}
                  total={form.total}
                />

                {form.submitError && (
                  <p className="text-sm text-red-700" role="alert">
                    {form.submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={form.submitting}
                  className="w-full rounded-md bg-red-800 py-3 text-sm font-semibold text-white
                    hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700
                    disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {form.submitting ? 'Submitting…' : 'Reserve Table'}
                </button>
              </form>

              <p className="mt-6 text-xs text-gray-500 text-center">
                Prepayment is required to confirm your reservation. Our team
                will contact you to arrange payment.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}