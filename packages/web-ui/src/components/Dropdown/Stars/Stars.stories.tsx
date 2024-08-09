import { Stars } from './Stars'

export default {
  component: Stars,
}

export const Primary = () => {
  return <Stars no_selected={2} on_click={() => {}} />
}
