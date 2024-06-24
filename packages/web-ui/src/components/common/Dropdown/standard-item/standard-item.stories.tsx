import { StandardItem } from './standard-item'

export default {
  component: StandardItem,
}

export const Primary = () => {
  return (
    <StandardItem
      icon_variant="ARCHIVE"
      label="Lorem ipsum"
      on_click={() => {}}
    />
  )
}
