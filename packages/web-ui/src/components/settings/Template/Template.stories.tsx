import { Template } from './Template'

export default {
  component: Template,
}

export const Primary = () => {
  return (
    <Template
      slot_header={<div>header</div>}
      slot_desktop_navigation={<div>desktop nav</div>}
      slot_mobile_navigation={<div>mobile nav</div>}
      slot_main={<div>main</div>}
    />
  )
}
