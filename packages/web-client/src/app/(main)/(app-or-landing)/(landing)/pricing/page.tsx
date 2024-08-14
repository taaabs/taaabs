import { get_dictionary } from '@/app/get_dictionary'
import Pricing from './pricing'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return <Pricing dictionary={dictionary} />
}

export default Page
