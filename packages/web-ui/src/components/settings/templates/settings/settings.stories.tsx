import { Settings } from './settings'

export default {
  component: Settings,
}

export const Primary = () => {
  return (
    <Settings
      headerSlot={<div>header</div>}
      desktopNavigationSlot={<div>desktop nav</div>}
      mobileNavigationSlot={<div>mobile nav</div>}
      mainSlot={<div>main</div>}
    />
  )
}
