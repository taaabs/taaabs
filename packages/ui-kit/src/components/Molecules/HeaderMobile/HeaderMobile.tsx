import { Hamburger } from '@/components/Atoms/Hamburger'
import { sharedValues } from '@/constants'
import { Theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export namespace HeaderMobile {
  export type Props = {
    userDisplayName: string
    backHref: string
    hamburgerIsToggled: boolean
    onClickHamburger: () => void
    onClickTheme: () => void
    currentTheme: 'LIGHT' | 'DARK' | 'OS'
  }
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return <S.container></S.container>
}

namespace S {
  export const container = styled.div`
    height: var(${sharedValues.HEADER_MOBILE_HEIGHT});
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(${Theme.COLOR_WHITE});
    border-bottom: var(${Theme.BORDER_PRIMARY});
    box-sizing: content-box;
  `
  export const content = styled.div`
    flex: 1;
  `
}
