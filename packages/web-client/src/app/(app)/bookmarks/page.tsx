import { get_dictionary } from '@/app/dictonaries'
import BookmarksPage from '../bookmarks-page'
import { RecentVisitSubmitter } from './recent-visit-submitter'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return (
    <>
      <RecentVisitSubmitter />
      <BookmarksPage dictionary={dictionary} />
    </>
  )
}

export default Page
