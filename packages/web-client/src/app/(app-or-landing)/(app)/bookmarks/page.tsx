import { get_dictionary } from '@/app/get_dictionary'
import { VisitRecorder } from './visit-recorder'
import { ClearLibraryDataOnRefresh } from './clear-library-data-on-refresh'
import { LibraryWrapper } from './library-wrapper'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Page: React.FC = async () => {
  const user_id = cookies().get('user_id')
  if (!user_id) redirect('/login')
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
