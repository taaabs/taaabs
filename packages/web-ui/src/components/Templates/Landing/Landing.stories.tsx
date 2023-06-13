import { Landing } from './Landing'

export default {
  component: Landing,
}

export const Primary = () => {
  return (
    <Landing
      slotRightSide={<div>right side slot</div>}
      footerSlot={<div>footer slot</div>}
    >
      children
    </Landing>
  )
}
