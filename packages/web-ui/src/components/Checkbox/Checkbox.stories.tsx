import { Checkbox } from './Checkbox'

export default {
  component: Checkbox,
}

export const Default = () => {
  return (
    <Checkbox is_checked={true} label="Lorem ipsum" on_click={() => {}} />
  )
}
