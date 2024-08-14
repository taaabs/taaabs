import { get_dictionary } from '@/app/get_dictionary'
import { LibraryWrapper } from './library-wrapper'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return <LibraryWrapper dictionary={dictionary} />
}

export default Page
