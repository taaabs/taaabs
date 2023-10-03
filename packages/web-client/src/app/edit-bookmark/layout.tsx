import { SimpleBackArrowHeader } from '@web-ui/components/app/atoms/simple-back-arrow-header'
import { Form } from '@web-ui/components/app/templates/form'

const Page: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <Form
      slot_header={
        <SimpleBackArrowHeader back_href="/" title="Edit bookmark" />
      }
    >
      {props.children}
    </Form>
  )
}

export default Page
