import { logout } from '@/app/(auth)/login/actions'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-blue-50/30">
            <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">태화기독교사회복지관</h1>
            <p className="text-sm font-medium text-blue-600 mt-1">상담일지 시스템</p>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              대시보드
            </Link>
            <Link 
              href="/clients" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              대상자 관리
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <form action={logout}>
              <button className="w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
