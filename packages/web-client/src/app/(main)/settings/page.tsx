import { get_dictionary } from '@/app/get_dictionary'
import { General } from './_general/General'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return <General dictionary={dictionary} />
}

export default Page
