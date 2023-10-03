'use client'

import { SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { Form } from '@web-ui/components/app/templates/form'
import { usePathname } from 'next/navigation'

const Page: React.FC<{ children: React.ReactNode }> = (props) => {
  const pathname = usePathname()

  let title: string = ''
  if (pathname == '/new-bookmark') {
    title = 'New bookmark'
  } else if (pathname.startsWith('/edit-bookmark')) {
    title = 'Edit bookmark'
  }
  return (
    <Form slot_header={<SimpleBackArrowHeader back_href="/" title={title} />}>
      {props.children}
    </Form>
  )
}

export default Page
