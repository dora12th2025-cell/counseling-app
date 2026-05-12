'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    throw new Error('인증되지 않은 사용자입니다.')
  }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const birth_date = formData.get('birth_date') as string
  const address = formData.get('address') as string

  const { error } = await supabase.from('clients').insert({
    name,
    phone: phone || null,
    birth_date: birth_date || null,
    address: address || null,
    created_by: userData.user.id,
  } as any)

  if (error) {
    console.error('Error creating client:', error)
    throw new Error('대상자 등록에 실패했습니다. (' + error.message + ')')
  }

  revalidatePath('/clients')
  revalidatePath('/')
  redirect('/clients')
}
