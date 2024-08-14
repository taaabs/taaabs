import { Metadata } from 'next'
import About from './about'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { get_dictionary } from '@/app/get_dictionary'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  if (!user_id) redirect('/')
  const dictionary = await get_dictionary()
  return <About is_authorized={true} dictionary={dictionary} />
}

export default Page

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: 'https://taaabs.com' },
}
