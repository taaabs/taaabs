import { sharedValues } from '@/constants'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export namespace BottomNavigationBar {
  export type Props = {
    x?: string
  }
}

export const BottomNavigationBar: React.FC<BottomNavigationBar.Props> = (
  props,
) => {
  return <S.container>x</S.container>
}

namespace S {
  export const container = styled.div`
    height: ${sharedValues.BOTTOM_NAVIGATION_BAR_HEIGHT}px;
    border-top: var(${Theme.BORDER_PRIMARY});
    background-color: ${sharedValues.TRANSPARENT_BACKGROUND_COLOR};
    backdrop-filter: ${sharedValues.BACKDROP_FILTER};
  `
}
