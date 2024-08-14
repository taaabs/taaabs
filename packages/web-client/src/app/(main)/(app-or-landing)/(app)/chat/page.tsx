import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Page: React.FC = () => {
  const user_id = cookies().get('user_id')
  const guest_user_id = cookies().get('guest_user_id')
  if (!user_id && !guest_user_id) redirect('/login')

  return (
    <div style={{ textAlign: 'center' }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      Arriving in summer 2024
    </div>
  )
}

export default Page
