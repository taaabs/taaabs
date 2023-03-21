import { ReactComponent as Activity } from '@/assets/icons/activity.svg'
import { ReactComponent as Alias } from '@/assets/icons/alias.svg'
import { ReactComponent as Archive } from '@/assets/icons/archive.svg'
import { ReactComponent as CollectionFilled } from '@/assets/icons/collection-filled.svg'
import { ReactComponent as Collection } from '@/assets/icons/collection.svg'
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
import { IconTypes } from './Icon.types'

const iconVariantMap: IconTypes.VariantMap = {
  [IconTypes.Variant.ACTIVITY]: <Activity />,
  [IconTypes.Variant.ALIAS]: <Alias />,
  [IconTypes.Variant.ARCHIVE]: <Archive />,
  [IconTypes.Variant.COLLECTION_FILLED]: <CollectionFilled />,
  [IconTypes.Variant.COLLECTION]: <Collection />,
  [IconTypes.Variant.HOME_FILLED]: <HomeFilled />,
  [IconTypes.Variant.HOME]: <Home />,
  [IconTypes.Variant.PIN]: <Pin />,
  [IconTypes.Variant.RECENT_FILLED]: <RecentFilled />,
  [IconTypes.Variant.RECENT]: <Recent />,
  [IconTypes.Variant.SORT]: <Sort />,
  [IconTypes.Variant.STAR_FILLED]: <StarFilled />,
  [IconTypes.Variant.STAR]: <Star />,
  [IconTypes.Variant.TRASH]: <Trash />,
  [IconTypes.Variant.LIKE]: <Like />,
  [IconTypes.Variant.LIKE_FILLED]: <LikeFilled />,
  [IconTypes.Variant.SWIPE_LEFT]: <SwipeLeft />,
  [IconTypes.Variant.SWIPE_RIGHT]: <SwipeRight />,
  [IconTypes.Variant.ARROW_LEFT]: <ArrowLeft />,
}

export const Icon: React.FC<IconTypes.Props> = (props) => {
  return <S.iconWrapper>{iconVariantMap[props.variant]}</S.iconWrapper>
}

namespace S {
  const iconSize = 20
  export const iconWrapper = styled.div`
    display: inline-flex;
    & > svg {
      width: ${iconSize}px;
      height: ${iconSize}px;
      fill: var(${Theme.COLOR_BLACK});
    }
  `
}
