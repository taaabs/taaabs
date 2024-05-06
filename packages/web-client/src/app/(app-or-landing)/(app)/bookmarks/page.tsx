import { get_dictionary } from '@/app/get_dictionary'
import { VisitRecorder } from './visit-recorder'
import { ClearLibraryDataOnRefresh } from './clear-library-data-on-refresh'
import { LibraryWrapper } from './library-wrapper'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return (
    <>
      <VisitRecorder />
      <ClearLibraryDataOnRefresh />
      <LibraryWrapper dictionary={dictionary} />
    </>
  )
}

export default Page
