import { _MobileTitleBar } from './_mobile-title-bar'

export default {
  component: _MobileTitleBar,
}

export const Primary = () => (
  <_MobileTitleBar
    swipeLeftOnClick={() => {}}
    swipeRightOnClick={() => {}}
    primaryText="Lorem ipsum"
    secondaryText="lorem"
  />
)
