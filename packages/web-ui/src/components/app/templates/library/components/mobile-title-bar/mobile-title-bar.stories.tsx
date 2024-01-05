import { MobileTitleBar } from './mobile-title-bar'

export default {
  component: MobileTitleBar,
}

export const Primary = () => (
  <MobileTitleBar
    swipe_left_on_click={() => {}}
    swipe_right_on_click={() => {}}
    text="lorem"
  />
)
