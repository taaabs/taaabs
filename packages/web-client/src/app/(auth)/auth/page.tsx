import { get_dictionary } from '@/app/dictonaries'
import { Auth } from './auth'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return <Auth dictionary={dictionary} />
}

export default Page
