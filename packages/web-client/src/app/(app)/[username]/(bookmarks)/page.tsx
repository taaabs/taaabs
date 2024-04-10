import { get_dictionary } from '@/app/dictonaries'
import { LibraryWrapper } from './library-wrapper'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return <LibraryWrapper dictionary={dictionary} />
}

export default Page
