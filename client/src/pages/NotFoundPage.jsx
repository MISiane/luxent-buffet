import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="holiday-bg min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-sm w-full">
        <h1 className="text-xl font-semibold text-black">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-red-800 hover:underline"
        >
          ← Back to reservation form
        </Link>
      </div>
    </main>
  )
}