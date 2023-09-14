import { Settings } from './settings'

export default {
  component: Settings,
}

export const Primary = () => {
  return (
    <Settings
      slot_header={<div>header</div>}
      slot_desktop_navigation={<div>desktop nav</div>}
      slot_mobile_navigation={<div>mobile nav</div>}
      slot_main={<div>main</div>}
    />
  )
}
