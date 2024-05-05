import { Metadata } from 'next'
import About from './about'

const Page: React.FC = () => {
  return <About />
}

export default Page

export const metadata: Metadata = {
  title: 'My Page Title',
  alternates: { canonical: 'https://taaabs.com' },
}
