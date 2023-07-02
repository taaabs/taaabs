import Link from 'next/link'

const Page: React.FC = () => {
  return (
    <div>
      <Link href="/test_user">test_user</Link>
      <br />
      <Link href="/test_user/library?sdf=dsf">test_user library</Link>
      <br />
      <Link href="/unknown_user">unknown_user</Link>
    </div>
  )
}

export default Page
