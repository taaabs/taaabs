import { get_dictionary } from '@/app/dictonaries'
import BookmarksPage from '../bookmarks-page'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return <BookmarksPage dictionary={dictionary} />
}

export default Page
