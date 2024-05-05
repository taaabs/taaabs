import { cookies } from 'next/headers'
import About from './(landing)/about/about'
import Home from './(app)/home'

const Page: React.FC = () => {
  const user_id = cookies().get('user_id')

  return user_id ? <Home /> : <About is_authorized={false} />
}

export default Page
