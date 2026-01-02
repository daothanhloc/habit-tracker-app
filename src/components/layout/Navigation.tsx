import React from 'react'
import { Home } from 'lucide-react'

export const Navigation: React.FC = () => {
  return (
    <nav className="relative bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-white/70 overflow-hidden">
      <div className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

      <div className="p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 text-indigo-600 border border-indigo-100">
            <Home size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-gray-500">Dashboard</p>
            <p className="text-lg sm:text-xl font-semibold text-gray-900">Habits</p>
            <p className="text-sm text-gray-500 hidden sm:block">
              Track your routines with a cleaner, focused view
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm text-gray-600 border border-gray-200">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Sync on
          </div>
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <span className="h-2 w-2 rounded-full bg-white/70" />
            <span className="text-sm font-semibold">Habits only</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
