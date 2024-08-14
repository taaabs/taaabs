import { cookies } from 'next/headers'
import About from './(landing)/about/about'
import Home from './(app)/home'
import { get_dictionary } from '../../get_dictionary'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  const dictionary = await get_dictionary()

  return user_id ? (
    <Home />
  ) : (
    <About dictionary={dictionary} is_authorized={false} />
  )
}

export default Page
