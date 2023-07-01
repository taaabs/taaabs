import { Landing } from './landing'

export default {
  component: Landing,
}

export const Primary = () => {
  return (
    <Landing
      slotLogo={<div>logo</div>}
      slotDesktopNavigation={<div>desktop navigation</div>}
      slotDesktopUser={<div>desktop user</div>}
      slotMobileNavigation={<div>mobile navigation</div>}
      slotFooter={<div>footer slot</div>}
    >
      <div>children</div>
    </Landing>
  )
}
