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
}

export const Icon: React.FC<IconTypes.Props> = (props) => {
  return <S.Wrapper>{iconVariantMap[props.variant]}</S.Wrapper>
}

namespace S {
  export const Wrapper = styled.div`
    display: inline-flex;
    & > svg {
      width: 20px;
      height: 20px;
      fill: var(${Theme.COLOR_BLACK});
    }
  `
}
