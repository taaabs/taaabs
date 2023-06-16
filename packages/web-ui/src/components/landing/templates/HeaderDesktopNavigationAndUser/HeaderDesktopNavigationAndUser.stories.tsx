import { HeaderDesktopNavigationAndUser } from './HeaderDesktopNavigationAndUser'

export default {
  component: HeaderDesktopNavigationAndUser,
}

export const Primary = () => {
  return (
    <HeaderDesktopNavigationAndUser
      navigationSlot={<div>navigation slot</div>}
      userSlot={<div>user slot</div>}
    />
  )
}
