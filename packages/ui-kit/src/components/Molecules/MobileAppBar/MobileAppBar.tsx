import { Hamburger } from '@/components/Atoms/Hamburger'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export namespace MobileAppBar {
  export type Props = {
    hamburgerIsToggled: boolean
    hamburgerOnClick: () => void
    tabsCount: number
    tabsOnClick: () => void
  }
}

export const MobileAppBar: React.FC<MobileAppBar.Props> = (props) => {
  return (
    <S.wrapper>
      <S.content>
        <Hamburger
          isToggled={props.hamburgerIsToggled}
          onClick={props.hamburgerOnClick}
        />
      </S.content>
      <div>tabCounter</div>
    </S.wrapper>
  )
}

namespace S {
  export const wrapper = styled.div`
    height: var(${Theme.MOBILE_TOP_BAR_HEIGHT});
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(${Theme.COLOR_WHITE});
    border-bottom: var(${Theme.BORDER_PRIMARY});
    padding-right: var(${Theme.SPACER_16});
    box-sizing: content-box;
  `
  export const content = styled.div`
    flex: 1;
  `
}
