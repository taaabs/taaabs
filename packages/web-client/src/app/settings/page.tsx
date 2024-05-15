import { get_dictionary } from '../get_dictionary'
import { Settings } from './settings'

const Page: React.FC = async () => {
  const dictionary = await get_dictionary()
  return <Settings dictionary={dictionary} />
}

export default Page
