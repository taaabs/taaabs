import { Landing } from './Landing'

export default {
  component: Landing,
}

export const Primary = () => {
  return (
    <Landing
      slot_logo={<div>logo</div>}
      slot_desktop_navigation={<div>desktop navigation</div>}
      slot_desktop_user={<div>desktop user</div>}
      slot_mobile_navigation={<div>mobile navigation</div>}
    >
      <div>children</div>
    </Landing>
  )
}
