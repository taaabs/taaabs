import { Metadata } from 'next'
import About from './about'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Page: React.FC = () => {
  const user_id = cookies().get('user_id')
  if (!user_id) redirect('/')
  return <About is_authorized={true} />
}

export default Page

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: 'https://taaabs.com' },
}
