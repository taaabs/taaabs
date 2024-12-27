import ActivityFilled from '../../assets/icons/activity-filled.svg'
import Activity from '../../assets/icons/activity.svg'
import Add from '../../assets/icons/add.svg'
import Archive from '../../assets/icons/archive.svg'
import BookmarkFilled from '../../assets/icons/bookmark-filled.svg'
import Bookmark from '../../assets/icons/bookmark.svg'
import Bulb from '../../assets/icons/bulb.svg'
import ChatBubbleCorner from '../../assets/icons/chat-bubble-corner.svg'
import Chat from '../../assets/icons/chat.svg'
import ChatFilled from '../../assets/icons/chat-filled.svg'
import Check from '../../assets/icons/check.svg'
import Chrome from '../../assets/icons/chrome.svg'
import Collapse from '../../assets/icons/collapse.svg'
import Copy from '../../assets/icons/copy.svg'
import Cross from '../../assets/icons/cross.svg'
import Delete from '../../assets/icons/delete.svg'
import DensityCompact from '../../assets/icons/density-compact.svg'
import DensityDefault from '../../assets/icons/density-default.svg'
import Edit from '../../assets/icons/edit.svg'
import ExtensionIcon from '../../assets/icons/extension-icon.svg'
import Eye from '../../assets/icons/eye.svg'
import GitHub from '../../assets/icons/github.svg'
import Globe from '../../assets/icons/globe.svg'
import Google from '../../assets/icons/google.svg'
import GreaterThan from '../../assets/icons/greater-than.svg'
import Handle from '../../assets/icons/handle.svg'
import Home from '../../assets/icons/home.svg'
import HomeFilled from '../../assets/icons/home-filled.svg'
import HuggingFace from '../../assets/icons/hugging-face.svg'
import HuggingFaceHands from '../../assets/icons/hugging-face-hands.svg'
import HuggingFaceNoHands from '../../assets/icons/hugging-face-no-hands.svg'
import LessThan from '../../assets/icons/less-than.svg'
import Link from '../../assets/icons/link.svg'
import Logo from '../../assets/icons/logo.svg'
import MobileTitleBarLeft from '../../assets/icons/mobile-title-bar-left.svg'
import MobileTitleBarRight from '../../assets/icons/mobile-title-bar-right.svg'
import More from '../../assets/icons/more.svg'
import NewTab from '../../assets/icons/new-tab.svg'
import Note from '../../assets/icons/note.svg'
import Notifications from '../../assets/icons/notifications.svg'
import NotificationsFilled from '../../assets/icons/notifications-filled.svg'
import Pin from '../../assets/icons/pin.svg'
import Play from '../../assets/icons/play.svg'
import Recent from '../../assets/icons/recent.svg'
import Resize from '../../assets/icons/resize.svg'
import Restore from '../../assets/icons/restore.svg'
import Screenshot from '../../assets/icons/screenshot.svg'
import Search from '../../assets/icons/search.svg'
import Selected from '../../assets/icons/selected.svg'
import SelectedBold from '../../assets/icons/selected-bold.svg'
import Send from '../../assets/icons/send.svg'
import Settings from '../../assets/icons/settings.svg'
import Sidebar from '../../assets/icons/sidebar.svg'
import Star from '../../assets/icons/star.svg'
import StarFilled from '../../assets/icons/star-filled.svg'
import Taaabs from '../../assets/icons/taaabs.svg'
import Tag from '../../assets/icons/tag.svg'
import ThemeAuto from '../../assets/icons/theme-auto.svg'
import ThemeDark from '../../assets/icons/theme-dark.svg'
import ThemeLight from '../../assets/icons/theme-light.svg'
import ThreeDots from '../../assets/icons/three-dots.svg'
import User from '../../assets/icons/user.svg'
import UserFilled from '../../assets/icons/user-filled.svg'

export namespace Icon {
  export type Variant =
    | 'ACTIVITY'
    | 'ACTIVITY_FILLED'
    | 'ADD'
    | 'ARCHIVE'
    | 'BOOKMARK'
    | 'BOOKMARK_FILLED'
    | 'BULB'
    | 'CHAT'
    | 'CHAT_BUBBLE_CORNER'
    | 'CHAT_FILLED'
    | 'CHECK'
    | 'CHROME'
    | 'COLLAPSE'
    | 'COPY'
    | 'CROSS'
    | 'DELETE'
    | 'DENSITY_COMPACT'
    | 'DENSITY_DEFAULT'
    | 'EDIT'
    | 'EXTENSION_ICON'
    | 'EYE'
    | 'GITHUB'
    | 'GLOBE'
    | 'GOOGLE'
    | 'GREATER_THAN'
    | 'HANDLE'
    | 'HOME'
    | 'HOME_FILLED'
    | 'HUGGING_FACE'
    | 'HUGGING_FACE_HANDS'
    | 'HUGGING_FACE_NO_HANDS'
    | 'LESS_THAN'
    | 'LINK'
    | 'LOGO'
    | 'MOBILE_TITLE_BAR_LEFT'
    | 'MOBILE_TITLE_BAR_RIGHT'
    | 'MORE'
    | 'NEW_TAB'
    | 'NOTE'
    | 'NOTIFICATIONS'
    | 'NOTIFICATIONS_FILLED'
    | 'PIN'
    | 'PLAY'
    | 'RECENT'
    | 'RESIZE'
    | 'RESTORE'
    | 'SCREENSHOT'
    | 'SEARCH'
    | 'SELECTED'
    | 'SELECTED_BOLD'
    | 'SEND'
    | 'SETTINGS'
    | 'SIDEBAR'
    | 'STAR'
    | 'STAR_FILLED'
    | 'TAAABS'
    | 'TAG'
    | 'THEME_AUTO'
    | 'THEME_DARK'
    | 'THEME_LIGHT'
    | 'THREE_DOTS'
    | 'USER'
    | 'USER_FILLED'

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
    case 'ACTIVITY_FILLED':
      icon = <ActivityFilled />
      break
    case 'ADD':
      icon = <Add />
      break
    case 'ARCHIVE':
      icon = <Archive />
      break
    case 'BOOKMARK':
      icon = <Bookmark />
      break
    case 'BOOKMARK_FILLED':
      icon = <BookmarkFilled />
      break
    case 'BULB':
      icon = <Bulb />
      break
    case 'CHAT':
      icon = <Chat />
      break
    case 'CHAT_BUBBLE_CORNER':
      icon = <ChatBubbleCorner />
      break
    case 'CHAT_FILLED':
      icon = <ChatFilled />
      break
    case 'CHECK':
      icon = <Check />
      break
    case 'CHROME':
      icon = <Chrome />
      break
    case 'COLLAPSE':
      icon = <Collapse />
      break
    case 'COPY':
      icon = <Copy />
      break
    case 'CROSS':
      icon = <Cross />
      break
    case 'DELETE':
      icon = <Delete />
      break
    case 'DENSITY_COMPACT':
      icon = <DensityCompact />
      break
    case 'DENSITY_DEFAULT':
      icon = <DensityDefault />
      break
    case 'EDIT':
      icon = <Edit />
      break
    case 'EXTENSION_ICON':
      icon = <ExtensionIcon />
      break
    case 'EYE':
      icon = <Eye />
      break
    case 'GITHUB':
      icon = <GitHub />
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
    case 'HOME':
      icon = <Home />
      break
    case 'HOME_FILLED':
      icon = <HomeFilled />
      break
    case 'HUGGING_FACE':
      icon = <HuggingFace />
      break
    case 'HUGGING_FACE_HANDS':
      icon = <HuggingFaceHands />
      break
    case 'HUGGING_FACE_NO_HANDS':
      icon = <HuggingFaceNoHands />
      break
    case 'LESS_THAN':
      icon = <LessThan />
      break
    case 'LINK':
      icon = <Link />
      break
    case 'LOGO':
      icon = <Logo />
      break
    case 'MOBILE_TITLE_BAR_LEFT':
      icon = <MobileTitleBarLeft />
      break
    case 'MOBILE_TITLE_BAR_RIGHT':
      icon = <MobileTitleBarRight />
      break
    case 'MORE':
      icon = <More />
      break
    case 'NEW_TAB':
      icon = <NewTab />
      break
    case 'NOTE':
      icon = <Note />
      break
    case 'NOTIFICATIONS':
      icon = <Notifications />
      break
    case 'NOTIFICATIONS_FILLED':
      icon = <NotificationsFilled />
      break
    case 'PIN':
      icon = <Pin />
      break
    case 'PLAY':
      icon = <Play />
      break
    case 'RECENT':
      icon = <Recent />
      break
    case 'RESIZE':
      icon = <Resize />
      break
    case 'RESTORE':
      icon = <Restore />
      break
    case 'SCREENSHOT':
      icon = <Screenshot />
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
    case 'SEND':
      icon = <Send />
      break
    case 'SETTINGS':
      icon = <Settings />
      break
    case 'SIDEBAR':
      icon = <Sidebar />
      break
    case 'STAR':
      icon = <Star />
      break
    case 'STAR_FILLED':
      icon = <StarFilled />
      break
    case 'TAAABS':
      icon = <Taaabs />
      break
    case 'TAG':
      icon = <Tag />
      break
    case 'THEME_AUTO':
      icon = <ThemeAuto />
      break
    case 'THEME_DARK':
      icon = <ThemeDark />
      break
    case 'THEME_LIGHT':
      icon = <ThemeLight />
      break
    case 'THREE_DOTS':
      icon = <ThreeDots />
      break
    case 'USER':
      icon = <User />
      break
    case 'USER_FILLED':
      icon = <UserFilled />
      break
  }

  return icon
}