import { get_dictionary } from '@/app/dictonaries'
import { VisitRecorder } from './visit-recorder'
import { ClearLibraryDataOnRefresh } from './clear-library-data-on-refresh'
import { LibraryWrapper } from './library-wrapper'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary('en')
  return (
    <>
      <VisitRecorder />
      <ClearLibraryDataOnRefresh />
      <LibraryWrapper dictionary={dictionary} />
    </>
  )
}

export default Page
