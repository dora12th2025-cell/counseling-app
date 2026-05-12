import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 통계 데이터 가져오기 (전체 대상자 수, 전체 상담 건수)
  const { count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: sessionsCount } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })

  // 최근 상담 내역 가져오기
  const { data: recentSessionsData } = await supabase
    .from('sessions')
    .select(`
      id,
      session_date,
      content,
      clients ( name )
    `)
    .order('session_date', { ascending: false })
    .limit(5)
    
  const recentSessions = recentSessionsData as any[]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">환영합니다! 👋</h2>
        <p className="text-gray-500 mt-1">오늘의 복지관 상담 현황을 확인해보세요.</p>
      </div>
      
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">등록된 총 대상자</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{clientsCount || 0}<span className="text-sm font-normal text-gray-500 ml-1">명</span></p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">누적 상담 건수</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{sessionsCount || 0}<span className="text-sm font-normal text-gray-500 ml-1">건</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 상담 내역 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">최근 진행된 상담</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {recentSessions && recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {/* @ts-ignore */}
                      {session.clients?.name} 대상자
                    </p>
                    <p className="text-gray-600 mt-1 line-clamp-2 text-sm">{session.content}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap ml-4">
                    {session.session_date}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              최근 진행된 상담 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
