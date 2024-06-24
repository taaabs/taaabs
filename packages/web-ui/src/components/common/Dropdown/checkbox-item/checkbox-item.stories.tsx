import { CheckboxItem } from './checkbox-item'

export default {
  component: CheckboxItem,
}

export const Primary = () => {
  return (
    <CheckboxItem is_checked={true} label="Lorem ipsum" on_click={() => {}} />
  )
}
