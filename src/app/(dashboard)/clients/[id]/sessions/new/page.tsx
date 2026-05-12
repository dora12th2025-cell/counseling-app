import { createSessionAction } from '../actions'
import Link from 'next/link'

export default async function NewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">신규 상담일지 작성</h2>
        <p className="text-gray-500 mt-1">대상자와의 상담 내용과 향후 개입 계획을 상세히 기록해 주세요.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form action={createSessionAction} className="space-y-6">
          <input type="hidden" name="client_id" value={id} />
          
          <div className="space-y-5">
            <div>
              <label htmlFor="session_date" className="block text-sm font-medium text-gray-700">
                상담 일자 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="session_date"
                name="session_date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                상담 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={6}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
                placeholder="대상자와의 주된 상담 내용, 관찰 사항, 나눈 대화 등을 상세히 적어주세요."
              ></textarea>
            </div>

            <div>
              <label htmlFor="future_plan" className="block text-sm font-medium text-gray-700">
                향후 개입 계획
              </label>
              <textarea
                id="future_plan"
                name="future_plan"
                rows={4}
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
                placeholder="다음 상담 시 다룰 내용이나, 복지관 차원에서의 서비스 제공 계획 등을 적어주세요."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              href={`/clients/${id}`}
              className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              상담일지 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
