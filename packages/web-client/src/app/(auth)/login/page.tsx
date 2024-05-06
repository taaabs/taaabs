import { get_dictionary } from '@/app/dictonaries'
import { LogIn } from './log-in'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  if (user_id) redirect('/')
  const dictionary = await get_dictionary('en')
  return <LogIn dictionary={dictionary} />
}

export default Page

export const metadata: Metadata = {
  title: 'Log in',
  alternates: { canonical: 'https://taaabs.com' },
}
