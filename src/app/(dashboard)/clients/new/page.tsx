import { createClientAction } from '../actions'
import Link from 'next/link'

export default function NewClientPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">신규 대상자 등록</h2>
        <p className="text-gray-500 mt-1">새로운 관리 대상자의 기본 정보를 입력해 주세요.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form action={createClientAction} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                대상자 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
                placeholder="홍길동"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  연락처
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
                  placeholder="010-0000-0000"
                />
              </div>
              
              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                  생년월일
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                주소
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors sm:text-sm"
                placeholder="서울특별시 강남구 테헤란로..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              href="/clients"
              className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
