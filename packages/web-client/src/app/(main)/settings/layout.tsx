import { get_dictionary } from '@/app/get_dictionary'
import { _Layout } from './_Layout'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Layout: React.FC<{ children?: React.ReactNode }> = async ({
  children,
}) => {
  const user_id = cookies().get('user_id')
  const guest_user_id = cookies().get('guest_user_id')
  if (!user_id && !guest_user_id) redirect('/')
  const dictionary = await get_dictionary()
  return <_Layout dictionary={dictionary}>{children}</_Layout>
}

export default Layout
