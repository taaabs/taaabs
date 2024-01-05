import Activity from '../../../../assets/icons/activity.svg'
import Add from '../../../../assets/icons/add.svg'
import Archive from '../../../../assets/icons/archive.svg'
import BookmarkFilled from '../../../../assets/icons/bookmark-filled.svg'
import Bookmark from '../../../../assets/icons/bookmark.svg'
import Delete from '../../../../assets/icons/delete.svg'
import Edit from '../../../../assets/icons/edit.svg'
import Globe from '../../../../assets/icons/globe.svg'
import Google from '../../../../assets/icons/google.svg'
import GreaterThan from '../../../../assets/icons/greater-than.svg'
import Handle from '../../../../assets/icons/handle.svg'
import HomeFilled from '../../../../assets/icons/home-filled.svg'
import Home from '../../../../assets/icons/home.svg'
import Info from '../../../../assets/icons/info.svg'
import LessThan from '../../../../assets/icons/less-than.svg'
import Recent from '../../../../assets/icons/recent.svg'
import Remove from '../../../../assets/icons/remove.svg'
import Search from '../../../../assets/icons/search.svg'
import SelectedBold from '../../../../assets/icons/selected-bold.svg'
import Selected from '../../../../assets/icons/selected.svg'
import Sidebar from '../../../../assets/icons/sidebar.svg'
import StarFilled from '../../../../assets/icons/star-filled.svg'
import Star from '../../../../assets/icons/star.svg'
import Sun from '../../../../assets/icons/sun.svg'
import ThreeDots from '../../../../assets/icons/three-dots.svg'
import Logo from '../../../../assets/icons/logo.svg'
import MobileTitleBarMenu from '../../../../assets/icons/mobile-title-bar-menu.svg'
import MobileTitleBarViewOptions from '../../../../assets/icons/mobile-title-bar-view-options.svg'
import NewTab from '../../../../assets/icons/new-tab.svg'
import NotificationsFilled from '../../../../assets/icons/notifications-filled.svg'
import Notifications from '../../../../assets/icons/notifications.svg'
import UserAdd from '../../../../assets/icons/user-add.svg'
import UserRemove from '../../../../assets/icons/user-remove.svg'
import User from '../../../../assets/icons/user.svg'

export namespace Icon {
  export type Variant =
    | 'ACTIVITY'
    | 'ADD'
    | 'ARCHIVE'
    | 'BOOKMARK_FILLED'
    | 'BOOKMARK'
    | 'DELETE'
    | 'EDIT'
    | 'GLOBE'
    | 'GOOGLE'
    | 'GREATER_THAN'
    | 'HANDLE'
    | 'HOME_FILLED'
    | 'HOME'
    | 'INFO'
    | 'LESS_THAN'
    | 'RECENT'
    | 'REMOVE'
    | 'SEARCH'
    | 'SELECTED_BOLD'
    | 'SELECTED'
    | 'SIDEBAR'
    | 'STAR_FILLED'
    | 'STAR'
    | 'SUN'
    | 'THREE_DOTS'
    | 'LOGO'
    | 'MOBILE_TITLE_BAR_MENU'
    | 'MOBILE_TITLE_BAR_VIEW_OPTIONS'
    | 'NEW_TAB'
    | 'NOTIFICATIONS_FILLED'
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
    case 'ACTIVITY':
      icon = <Activity />
      break
    case 'ADD':
      icon = <Add />
      break
    case 'ARCHIVE':
      icon = <Archive />
      break
    case 'BOOKMARK_FILLED':
      icon = <BookmarkFilled />
      break
    case 'BOOKMARK':
      icon = <Bookmark />
      break
    case 'DELETE':
      icon = <Delete />
      break
    case 'EDIT':
      icon = <Edit />
      break
    case 'GLOBE':
      icon = <Globe />
      break
    case 'GOOGLE':
      icon = <Google />
      break
    case 'GREATER_THAN':
      icon = <GreaterThan />
      break
    case 'HANDLE':
      icon = <Handle />
      break
    case 'HOME_FILLED':
      icon = <HomeFilled />
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
    case 'NOTIFICATIONS_FILLED':
      icon = <NotificationsFilled />
      break
    case 'NOTIFICATIONS':
      icon = <Notifications />
      break
    case 'RECENT':
      icon = <Recent />
      break
    case 'REMOVE':
      icon = <Remove />
      break
    case 'SEARCH':
      icon = <Search />
      break
    case 'SELECTED_BOLD':
      icon = <SelectedBold />
      break
    case 'SELECTED':
      icon = <Selected />
      break
    case 'SIDEBAR':
      icon = <Sidebar />
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
