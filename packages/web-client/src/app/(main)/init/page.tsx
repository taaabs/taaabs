import { get_dictionary } from '@/app/get_dictionary'
import { Init } from './init'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  const guest_user_id = cookies().get('guest_user_id')
  if (user_id || guest_user_id) redirect('/')
  const dictionary = await get_dictionary()
  return <Init dictionary={dictionary} />
}

export default Page

export const metadata: Metadata = {
  title: 'Initializing...',
}
