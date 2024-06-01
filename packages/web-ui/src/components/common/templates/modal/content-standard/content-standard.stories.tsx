import { ContentStandard } from './content-standard'

export default {
  component: ContentStandard,
}

export const Primary = () => {
  return (
    <ContentStandard
      slot_header={<>header</>}
      slot_footer={<>footer</>}
      width={500}
    >
      <div>content</div>
      <div>content</div>
    </ContentStandard>
  )
}
