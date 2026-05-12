'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSessionAction(formData: FormData) {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const client_id = formData.get('client_id') as string
  const session_date = formData.get('session_date') as string
  const content = formData.get('content') as string
  const future_plan = formData.get('future_plan') as string

  const { error } = await supabase.from('sessions').insert({
    client_id,
    session_date,
    content,
    future_plan: future_plan || null,
    created_by: userData.user.id,
  } as any)

  if (error) {
    console.error('Error creating session:', error)
    return { error: '상담일지 등록에 실패했습니다.' }
  }

  revalidatePath(`/clients/${client_id}`)
  revalidatePath('/')
  redirect(`/clients/${client_id}`)
}
