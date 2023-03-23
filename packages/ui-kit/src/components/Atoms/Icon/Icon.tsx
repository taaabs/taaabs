import { ReactComponent as Activity } from '@/assets/icons/activity.svg'
import { ReactComponent as Alias } from '@/assets/icons/alias.svg'
import { ReactComponent as Archive } from '@/assets/icons/archive.svg'
import { ReactComponent as CollectionFilled } from '@/assets/icons/collection-filled.svg'
import { ReactComponent as Collection } from '@/assets/icons/collection.svg'
import { ReactComponent as GreaterThan } from '@/assets/icons/greater-than.svg'
import { ReactComponent as HomeFilled } from '@/assets/icons/home-filled.svg'
import { ReactComponent as Home } from '@/assets/icons/home.svg'
import { ReactComponent as Pin } from '@/assets/icons/pin.svg'
import { ReactComponent as RecentFilled } from '@/assets/icons/recent-filled.svg'
import { ReactComponent as Recent } from '@/assets/icons/recent.svg'
import { ReactComponent as Sort } from '@/assets/icons/sort.svg'
import { ReactComponent as StarFilled } from '@/assets/icons/star-filled.svg'
import { ReactComponent as Star } from '@/assets/icons/star.svg'
import { ReactComponent as Trash } from '@/assets/icons/trash.svg'
import { ReactComponent as Like } from '@/assets/icons/like.svg'
import { ReactComponent as LikeFilled } from '@/assets/icons/like-filled.svg'
import { ReactComponent as SwipeLeft } from '@/assets/icons/swipe-left.svg'
import { ReactComponent as SwipeRight } from '@/assets/icons/swipe-right.svg'
import { ReactComponent as ArrowLeft } from '@/assets/icons/arrow-left.svg'
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
    | 'PIN'
    | 'RECENT_FILLED'
    | 'RECENT'
    | 'SORT'
    | 'STAR_FILLED'
    | 'STAR'
    | 'TRASH'
    | 'LIKE'
    | 'LIKE_FILLED'
    | 'SWIPE_LEFT'
    | 'SWIPE_RIGHT'
    | 'ARROW_LEFT'

  export type Props = {
    variant: Variant
  }
}

export const Icon: React.FC<Icon.Props> = (props) => {
  let icon: JSX.Element
  switch (props.variant) {
    case 'ACTIVITY':
      icon = <Activity />
      break
    case 'ALIAS':
      icon = <Alias />
      break
    case 'ARCHIVE':
      icon = <Archive />
      break
    case 'ARROW_LEFT':
      icon = <ArrowLeft />
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
    case 'HOME_FILLED':
      icon = <HomeFilled />
      break
    case 'LIKE':
      icon = <Like />
      break
    case 'LIKE_FILLED':
      icon = <LikeFilled />
      break
    case 'PIN':
      icon = <Pin />
      break
    case 'RECENT':
      icon = <Recent />
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
  }
  return <S.iconWrapper>{icon}</S.iconWrapper>
}

namespace S {
  const ICON_SIZE = 20

  export const iconWrapper = styled.div`
    display: inline-flex;
    & > svg {
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
      fill: var(${Theme.COLOR_BLACK});
    }
  `
}
