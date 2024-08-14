import { get_dictionary } from '@/app/get_dictionary'
import { VisitRecorder } from './VisitRecorder'
import { ClearLibraryDataOnRefresh } from './ClearLibraryDataOnRefresh'
import { LibraryWrapper } from './LibraryWrapper'

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
