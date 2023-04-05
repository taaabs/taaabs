import { ReactComponent as Activity } from '@/assets/icons/activity.svg'
import { ReactComponent as Alias } from '@/assets/icons/alias.svg'
import { ReactComponent as Archive } from '@/assets/icons/archive.svg'
import { ReactComponent as CollectionFilled } from '@/assets/icons/collection-filled.svg'
import { ReactComponent as Collection } from '@/assets/icons/collection.svg'
import { ReactComponent as GreaterThan } from '@/assets/icons/greater-than.svg'
import { ReactComponent as HomeFilled } from '@/assets/icons/home-filled.svg'
import { ReactComponent as Home } from '@/assets/icons/home.svg'
import { ReactComponent as LessThan } from '@/assets/icons/less-than.svg'
import { ReactComponent as Pin } from '@/assets/icons/pin.svg'
import { ReactComponent as RecentFilled } from '@/assets/icons/recent-filled.svg'
import { ReactComponent as Recent } from '@/assets/icons/recent.svg'
import { ReactComponent as Search } from '@/assets/icons/search.svg'
import { ReactComponent as Sort } from '@/assets/icons/sort.svg'
import { ReactComponent as StarFilled } from '@/assets/icons/star-filled.svg'
import { ReactComponent as Star } from '@/assets/icons/star.svg'
import { ReactComponent as Sun } from '@/assets/icons/sun.svg'
import { ReactComponent as Trash } from '@/assets/icons/trash.svg'
import { ReactComponent as LikeFilled } from '@/assets/icons/like-filled.svg'
import { ReactComponent as Like } from '@/assets/icons/like.svg'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'
import { ReactComponent as SwipeLeft } from '@/assets/icons/swipe-left.svg'
import { ReactComponent as SwipeRight } from '@/assets/icons/swipe-right.svg'
import { ReactComponent as UserAdd } from '@/assets/icons/user-add.svg'
import { ReactComponent as UserRemove } from '@/assets/icons/user-remove.svg'
import { ReactComponent as User } from '@/assets/icons/user.svg'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export namespace Icon {
  export type Variant =
    | 'ACTIVITY'
    | 'ALIAS'
    | 'ARCHIVE'
    | 'COLLECTION_FILLED'
    | 'COLLECTION'
    | 'GREATER_THAN'
    | 'HOME_FILLED'
    | 'HOME'
    | 'LESS_THAN'
    | 'PIN'
    | 'SEARCH'
    | 'RECENT_FILLED'
    | 'RECENT'
    | 'SORT'
    | 'STAR_FILLED'
    | 'STAR'
    | 'SUN'
    | 'TRASH'
    | 'LIKE_FILLED'
    | 'LIKE'
    | 'LOGO'
    | 'SWIPE_LEFT'
    | 'SWIPE_RIGHT'
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
    case 'ALIAS':
      icon = <Alias />
      break
    case 'ARCHIVE':
      icon = <Archive />
      break
    case 'COLLECTION':
      icon = <Collection />
      break
    case 'COLLECTION_FILLED':
      icon = <CollectionFilled />
      break
    case 'GREATER_THAN':
      icon = <GreaterThan />
      break
    case 'HOME':
      icon = <Home />
      break
    case 'LESS_THAN':
      icon = <LessThan />
      break
    case 'HOME_FILLED':
      icon = <HomeFilled />
      break
    case 'LIKE_FILLED':
      icon = <LikeFilled />
      break
    case 'LIKE':
      icon = <Like />
      break
    case 'LOGO':
      icon = <Logo />
      break
    case 'PIN':
      icon = <Pin />
      break
    case 'RECENT':
      icon = <Recent />
      break
    case 'SEARCH':
      icon = <Search />
      break
    case 'RECENT_FILLED':
      icon = <RecentFilled />
      break
    case 'SORT':
      icon = <Sort />
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
    case 'SWIPE_LEFT':
      icon = <SwipeLeft />
      break
    case 'SWIPE_RIGHT':
      icon = <SwipeRight />
      break
    case 'TRASH':
      icon = <Trash />
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
  return <S.iconWrapper>{icon}</S.iconWrapper>
}

namespace S {
  const ICON_SIZE = 40

  export const iconWrapper = styled.div`
    display: inline-flex;
    svg {
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
      fill: var(${Theme.COLOR_BLACK});
    }
  `
}
