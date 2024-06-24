import { get_dictionary } from '../get_dictionary'
import { Page as GeneralPage } from './_general/page'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return <GeneralPage dictionary={dictionary} />
}

export default Page
