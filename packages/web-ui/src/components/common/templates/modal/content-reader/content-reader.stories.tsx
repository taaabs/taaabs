import { ContentReader } from './content-reader'

export default {
  component: ContentReader,
}

export const Primary = () => {
  return (
    <ContentReader
      slot_left_panel={<>left panel</>}
      slot_right_panel={<>right panel</>}
    >
      Lorem ipsum
    </ContentReader>
  )
}
