import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const supabase = await createClient()

  let request = supabase
    .from('clients')
    .select(`
      *,
      profiles:created_by ( name )
    `)
    .order('created_at', { ascending: false })

  if (query) {
    request = request.ilike('name', `%${query}%`)
  }

  const { data: clientsData, error } = await request
  const clients = clientsData as any[]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">대상자 관리</h2>
          <p className="text-gray-500 mt-1">등록된 전체 대상자 목록을 확인하고 관리합니다.</p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors shadow-sm"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          신규 등록
        </Link>
      </div>

      {/* 검색 바 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-shadow hover:shadow-md">
        <form className="w-full flex gap-3" method="GET" action="/clients">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="대상자 이름으로 검색..."
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 대상자 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">연락처</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">생년월일</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">등록일</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">담당자</th>
                <th scope="col" className="px-6 py-4 relative">
                  <span className="sr-only">액션</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{client.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{client.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{client.birth_date || '-'}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                      {client.registration_date}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                      {/* @ts-ignore */}
                      {client.profiles?.name || '-'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/clients/${client.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 group-hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">등록된 대상자가 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500">새로운 대상자를 등록하여 관리를 시작해 보세요.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
