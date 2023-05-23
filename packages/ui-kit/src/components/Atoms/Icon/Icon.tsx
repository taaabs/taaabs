import { ReactComponent as Add } from '@/assets/icons/add.svg'
import { ReactComponent as Bookmark } from '@/assets/icons/bookmark.svg'
import { ReactComponent as GreaterThan } from '@/assets/icons/greater-than.svg'
import { ReactComponent as LessThan } from '@/assets/icons/less-than.svg'
import { ReactComponent as Search } from '@/assets/icons/search.svg'
import { ReactComponent as StarFilled } from '@/assets/icons/star-filled.svg'
import { ReactComponent as Star } from '@/assets/icons/star.svg'
import { ReactComponent as Sun } from '@/assets/icons/sun.svg'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'
import { ReactComponent as MobileTitleBarMenu } from '@/assets/icons/mobile-title-bar-menu.svg'
import { ReactComponent as MobileTitleBarViewOptions } from '@/assets/icons/mobile-title-bar-view-options.svg'
import { ReactComponent as Notifications } from '@/assets/icons/notifications.svg'
import { ReactComponent as UserAdd } from '@/assets/icons/user-add.svg'
import { ReactComponent as UserRemove } from '@/assets/icons/user-remove.svg'
import { ReactComponent as User } from '@/assets/icons/user.svg'
import { Theme } from '@/styles/components/GlobalStyles'
import styled from '@emotion/styled'

export namespace Icon {
  export type Variant =
    | 'ADD'
    | 'BOOKMARK'
    | 'GREATER_THAN'
    | 'LESS_THAN'
    | 'SEARCH'
    | 'STAR_FILLED'
    | 'STAR'
    | 'SUN'
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

export const Icon: React.FC<Icon.Props> = ({ variant }) => {
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
  return <$.iconWrapper>{icon}</$.iconWrapper>
}

namespace $ {
  export const iconWrapper = styled.div`
    display: inline-flex;
    svg {
      width: auto;
      height: auto;
      fill: var(${Theme.COLOR_BLACK});
    }
  `
}
