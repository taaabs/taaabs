import { SimpleBackArrowHeader } from './SimpleBackArrowHeader'

export default {
  component: SimpleBackArrowHeader,
}

export const Primary = () => {
  return <SimpleBackArrowHeader title="Lorem" back_href="" />
}

export const ForVerticalNavigation = () => {
  return (
    <SimpleBackArrowHeader
      title="Lorem"
      back_href=""
      is_transparent_on_desktop={true}
    />
  )
}
