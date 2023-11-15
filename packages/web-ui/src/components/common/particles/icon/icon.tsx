import Add from '@web-ui/assets/icons/add.svg'
import Archive from '@web-ui/assets/icons/archive.svg'
import Bookmark from '@web-ui/assets/icons/bookmark.svg'
import Delete from '@web-ui/assets/icons/delete.svg'
import Google from '@web-ui/assets/icons/google.svg'
import GreaterThan from '@web-ui/assets/icons/greater-than.svg'
import Home from '@web-ui/assets/icons/home.svg'
import Info from '@web-ui/assets/icons/info.svg'
import LessThan from '@web-ui/assets/icons/less-than.svg'
import Search from '@web-ui/assets/icons/search.svg'
import Selected from '@web-ui/assets/icons/selected.svg'
import SelectedBold from '@web-ui/assets/icons/selected-bold.svg'
import StarFilled from '@web-ui/assets/icons/star-filled.svg'
import Star from '@web-ui/assets/icons/star.svg'
import Sun from '@web-ui/assets/icons/sun.svg'
import ThreeDots from '@web-ui/assets/icons/three-dots.svg'
import Logo from '@web-ui/assets/icons/logo.svg'
import MobileTitleBarMenu from '@web-ui/assets/icons/mobile-title-bar-menu.svg'
import MobileTitleBarViewOptions from '@web-ui/assets/icons/mobile-title-bar-view-options.svg'
import NewTab from '@web-ui/assets/icons/new-tab.svg'
import Notifications from '@web-ui/assets/icons/notifications.svg'
import UserAdd from '@web-ui/assets/icons/user-add.svg'
import UserRemove from '@web-ui/assets/icons/user-remove.svg'
import User from '@web-ui/assets/icons/user.svg'

export namespace Icon {
  export type Variant =
    | 'ADD'
    | 'ARCHIVE'
    | 'BOOKMARK'
    | 'DELETE'
    | 'GOOGLE'
    | 'GREATER_THAN'
    | 'HOME'
    | 'INFO'
    | 'LESS_THAN'
    | 'SEARCH'
    | 'SELECTED'
    | 'SELECTED_BOLD'
    | 'STAR_FILLED'
    | 'STAR'
    | 'SUN'
    | 'THREE_DOTS'
    | 'LOGO'
    | 'MOBILE_TITLE_BAR_MENU'
    | 'MOBILE_TITLE_BAR_VIEW_OPTIONS'
    | 'NEW_TAB'
    | 'NOTIFICATIONS'
    | 'USER_ADD'
    | 'USER_REMOVE'
    | 'USER'

  export type Props = {
    variant: Variant
  }
}

export const Icon: React.FC<Icon.Props> = ({ variant }) => {
  let icon: JSX.Element

  switch (variant) {
    case 'ADD':
      icon = <Add />
      break
    case 'ARCHIVE':
      icon = <Archive />
      break
    case 'BOOKMARK':
      icon = <Bookmark />
      break
    case 'DELETE':
      icon = <Delete />
      break
    case 'GOOGLE':
      icon = <Google />
      break
    case 'GREATER_THAN':
      icon = <GreaterThan />
      break
    case 'HOME':
      icon = <Home />
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
    case 'NEW_TAB':
      icon = <NewTab />
      break
    case 'NOTIFICATIONS':
      icon = <Notifications />
      break
    case 'SEARCH':
      icon = <Search />
      break
    case 'SELECTED':
      icon = <Selected />
      break
    case 'SELECTED_BOLD':
      icon = <SelectedBold />
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

  return icon
}
