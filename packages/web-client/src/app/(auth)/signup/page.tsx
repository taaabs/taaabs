import { get_dictionary } from '@/app/dictonaries'
import { SignUp } from './sign-up'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  if (user_id) redirect('/')
  const dictionary = await get_dictionary('en')
  return <SignUp dictionary={dictionary} />
}

export default Page

export const metadata: Metadata = {
  title: 'Sign up',
  alternates: { canonical: 'https://taaabs.com' },
}
