import { get_dictionary } from '@/app/get_dictionary'
import { VisitRecorder } from './VisitRecorder'
import { ClearLibraryDataOnRefresh } from './ClearLibraryDataOnRefresh'
import { LibraryWrapper } from './LibraryWrapper'
import { ScrollRestoration } from './ScrollRestoration'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return (
    <>
      <VisitRecorder />
      <ScrollRestoration />
      <ClearLibraryDataOnRefresh />
      <LibraryWrapper dictionary={dictionary} />
    </>
  )
}

export default Page
