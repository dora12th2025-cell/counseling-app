import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 대상자 정보 가져오기
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select(`
      *,
      profiles:created_by ( name )
    `)
    .eq('id', id)
    .single()

  const client = clientData as any

  if (clientError || !client) {
    notFound()
  }

  // 상담일지 목록 가져오기
  const { data: sessionsData } = await supabase
    .from('sessions')
    .select(`
      *,
      profiles:created_by ( name )
    `)
    .eq('client_id', id)
    .order('session_date', { ascending: false })
    
  const sessions = sessionsData as any[]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* 뒤로 가기 & 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/clients" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            목록으로 돌아가기
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
              {client.name.charAt(0)}
            </div>
            {client.name} 대상자 상세 정보
          </h2>
        </div>
        <Link
          href={`/clients/${client.id}/sessions/new`}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          신규 상담일지 작성
        </Link>
      </div>

      {/* 대상자 기본 정보 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">연락처</p>
            <p className="text-base text-gray-900 mt-1">{client.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">생년월일</p>
            <p className="text-base text-gray-900 mt-1">{client.birth_date || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">등록일</p>
            <p className="text-base text-gray-900 mt-1">{client.registration_date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">담당자</p>
            <p className="text-base text-gray-900 mt-1">{(client.profiles as any)?.name || '-'}</p>
          </div>
          <div className="sm:col-span-2 md:col-span-4">
            <p className="text-sm text-gray-500 font-medium">주소</p>
            <p className="text-base text-gray-900 mt-1">{client.address || '-'}</p>
          </div>
        </div>
      </div>

      {/* 상담일지 타임라인 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">상담 이력 ({sessions?.length || 0}건)</h3>
        
        <div className="relative border-l-2 border-blue-100 ml-3 md:ml-4 space-y-8 pb-4">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.id} className="relative pl-8 md:pl-10">
                {/* Timeline dot */}
                <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1.5 ring-4 ring-white"></div>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {session.session_date}
                      </span>
                      <span className="text-sm text-gray-500 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        작성자: {(session.profiles as any)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-1">상담 내용</h4>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                        {session.content}
                      </p>
                    </div>
                    
                    {session.future_plan && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-1">향후 계획</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                          {session.future_plan}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-8 text-gray-500 py-4">
              작성된 상담 이력이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
