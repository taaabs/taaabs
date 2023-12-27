import { _MobileTitleBar } from './_mobile-title-bar'

export default {
  component: _MobileTitleBar,
}

export const Primary = () => (
  <_MobileTitleBar
    swipe_left_on_click={() => {}}
    swipe_right_on_click={() => {}}
    text="lorem"
  />
)
