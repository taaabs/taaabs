import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export namespace PageTitlebarMobile {
  export type Props = {
    swipeLeftOnClick: () => void
    swipeRightOnClick: () => void
    pageTitle: string
  }
}

export const PageTitlebarMobile: React.FC<PageTitlebarMobile.Props> = (
  props,
) => {
  return (
    <S.container>
      <S.swipe onClick={props.swipeLeftOnClick}>
        <Ui.Atoms.Icon variant="SWIPE_RIGHT" />
      </S.swipe>
      <div>x</div>
      <S.swipe onClick={props.swipeRightOnClick}>
        <Ui.Atoms.Icon variant="SWIPE_LEFT" />
      </S.swipe>
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    background-color: var(${Theme.COLOR_WHITE});
    border-bottom: var(${Theme.BORDER_PRIMARY});
    display: flex;
    justify-content: space-between;
    height: ${sharedValues.PAGE_TITLEBAR_MOBILE}px;
  `
  export const swipe = styled.button`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 var(${Theme.SPACER_16});
    > div > svg {
      width: ${sharedValues.ICON_SIZE}px;
      height: ${sharedValues.ICON_SIZE}px;
    }
  `
}
