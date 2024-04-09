import { get_dictionary } from '@/app/dictonaries'
import BookmarksPage from '../bookmarks-page'
import { RecentVisitSubmitter } from './recent-visit-submitter'
import { ClearLibraryDataOnRefresh } from './clear-library-data-on-refresh'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return (
    <>
      <RecentVisitSubmitter />
      <ClearLibraryDataOnRefresh />
      <BookmarksPage dictionary={dictionary} />
    </>
  )
}

export default Page
