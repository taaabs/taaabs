import Add from '@web-ui/assets/icons/add.svg'
import Bookmark from '@web-ui/assets/icons/bookmark.svg'
import GreaterThan from '@web-ui/assets/icons/greater-than.svg'
import Info from '@web-ui/assets/icons/info.svg'
import LessThan from '@web-ui/assets/icons/less-than.svg'
import Search from '@web-ui/assets/icons/search.svg'
import StarFilled from '@web-ui/assets/icons/star-filled.svg'
import Star from '@web-ui/assets/icons/star.svg'
import Sun from '@web-ui/assets/icons/sun.svg'
import ThreeDots from '@web-ui/assets/icons/three-dots.svg'
import Logo from '@web-ui/assets/icons/logo.svg'
import MobileTitleBarMenu from '@web-ui/assets/icons/mobile-title-bar-menu.svg'
import MobileTitleBarViewOptions from '@web-ui/assets/icons/mobile-title-bar-view-options.svg'
import Notifications from '@web-ui/assets/icons/notifications.svg'
import UserAdd from '@web-ui/assets/icons/user-add.svg'
import UserRemove from '@web-ui/assets/icons/user-remove.svg'
import User from '@web-ui/assets/icons/user.svg'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import styled from '@emotion/styled'

export namespace IconTypes {
  export type Variant =
    | 'ADD'
    | 'BOOKMARK'
    | 'GREATER_THAN'
    | 'INFO'
    | 'LESS_THAN'
    | 'SEARCH'
    | 'STAR_FILLED'
    | 'STAR'
    | 'SUN'
    | 'THREE_DOTS'
    | 'LOGO'
    | 'MOBILE_TITLE_BAR_MENU'
    | 'MOBILE_TITLE_BAR_VIEW_OPTIONS'
    | 'NOTIFICATIONS'
    | 'USER_ADD'
    | 'USER_REMOVE'
    | 'USER'

  export type Props = {
    variant: Variant
  }
}

export const Icon: React.FC<IconTypes.Props> = ({ variant }) => {
  let icon: JSX.Element

  switch (variant) {
    case 'ADD':
      icon = <Add />
      break
    case 'BOOKMARK':
      icon = <Bookmark />
      break
    case 'GREATER_THAN':
      icon = <GreaterThan />
      break
    case 'INFO':
      icon = <Info />
      break
    case 'LESS_THAN':
      icon = <LessThan />
      break
    case 'LOGO':
      icon = <Logo />
      break
    case 'MOBILE_TITLE_BAR_MENU':
      icon = <MobileTitleBarMenu />
      break
    case 'MOBILE_TITLE_BAR_VIEW_OPTIONS':
      icon = <MobileTitleBarViewOptions />
      break
    case 'NOTIFICATIONS':
      icon = <Notifications />
      break
    case 'SEARCH':
      icon = <Search />
      break
    case 'STAR':
      icon = <Star />
      break
    case 'SUN':
      icon = <Sun />
      break
    case 'THREE_DOTS':
      icon = <ThreeDots />
      break
    case 'STAR_FILLED':
      icon = <StarFilled />
      break
    case 'USER_ADD':
      icon = <UserAdd />
      break
    case 'USER_REMOVE':
      icon = <UserRemove />
      break
    case 'USER':
      icon = <User />
      break
  }
  return <_.iconWrapper>{icon}</_.iconWrapper>
}

namespace _ {
  export const iconWrapper = styled.div`
    display: inline-flex;
    > svg {
      fill: var(${Theme.COLOR_BLACK});
    }
  `
}
