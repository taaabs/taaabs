import Link from 'next/link'

const Page: React.FC = () => {
  return (
    <div>
      <Link href="/@alicia">alicia</Link>
      <Link href="/@alicia/library?sdf=dsf">alicia library</Link>
      <Link href="/@tom/">tom</Link>
    </div>
  )
}

export default Page
