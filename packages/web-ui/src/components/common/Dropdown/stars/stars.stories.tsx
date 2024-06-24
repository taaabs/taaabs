import { Stars } from './stars'

export default {
  component: Stars,
}

export const Primary = () => {
  return (
    <Stars is_checked={true} label="Lorem ipsum" on_click={() => {}} />
  )
}
