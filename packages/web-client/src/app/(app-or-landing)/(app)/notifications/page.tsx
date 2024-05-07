import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Page: React.FC = () => {
  const user_id = cookies().get('user_id')
  if (!user_id) redirect('/login')

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      UNDER CONSTRUCTION
    </div>
  )
}

export default Page
