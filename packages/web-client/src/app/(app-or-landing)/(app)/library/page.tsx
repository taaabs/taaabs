import { get_dictionary } from '@/app/get_dictionary'
import { VisitRecorder } from './VisitRecorder'
import { ClearLibraryDataOnRefresh } from './ClearLibraryDataOnRefresh'
import { LibraryWrapper } from './LibraryWrapper'
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
