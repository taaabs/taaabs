import { _MobileTitleBar } from './_MobileTitleBar'

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
