import { get_dictionary } from '@/app/dictonaries'
import { SignUp } from './sign-up'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return <SignUp dictionary={dictionary} />
}

export default Page
