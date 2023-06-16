import { Landing } from './Landing'

export default {
  component: Landing,
}

export const Primary = () => {
  return (
    <Landing
      slotMobileNavigation={<div>mobile nav</div>}
      slotLogo={<div>logo</div>}
      slotDesktopNavigation={<div>right side slot</div>}
      slotFooter={<div>footer slot</div>}
    >
      children
    </Landing>
  )
}
