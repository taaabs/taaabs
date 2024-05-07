import { get_dictionary } from '@/app/get_dictionary'
import { SignUp } from './sign-up'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  if (user_id) redirect('/')
  const dictionary = await get_dictionary()
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      container={{
        parameters: {},
      }}
    >
      <SignUp dictionary={dictionary} />
    </GoogleReCaptchaProvider>
  )
}

export default Page

export const metadata: Metadata = {
  title: 'Sign up',
}
