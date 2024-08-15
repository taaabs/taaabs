import { get_dictionary } from '@/app/get_dictionary'
import { Welcome } from './welcome'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { RecaptchaProvider } from '@/providers/RecaptchaProvider'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  const guest_id = cookies().get('guest_id')
  if (user_id || guest_id) redirect('/')
  const dictionary = await get_dictionary()
  return (
    <RecaptchaProvider>
      <Welcome dictionary={dictionary} />
    </RecaptchaProvider>
  )
}

export default Page

export const metadata: Metadata = {
  title: 'Welcome',
}
