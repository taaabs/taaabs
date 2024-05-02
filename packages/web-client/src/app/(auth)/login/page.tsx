import { get_dictionary } from '@/app/dictonaries'
import { LogIn } from './log-in'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return <LogIn dictionary={dictionary} />
}

export default Page
