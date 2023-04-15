import { Icon, LogoForHeader } from '@/components/Atoms'
import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export namespace HeaderMobile {
  export type Props = {
    hamburgerIsToggled: boolean
    onClickHamburger: () => void
    onClickTheme: () => void
    currentTheme: 'LIGHT' | 'DARK'
    viewedUser?: LogoForHeader.User
  }
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return (
    <$.container>
      <Ui.Atoms.LogoForHeader user={props.viewedUser} />
      <$.right>
        <$.Right.theme onClick={props.onClickTheme}>
          <Icon variant="SUN" />
        </$.Right.theme>
        <$.Right.hamburger onClick={props.onClickHamburger}>
          <Ui.Atoms.Hamburger isToggled={props.hamburgerIsToggled} />
        </$.Right.hamburger>
      </$.right>
    </$.container>
  )
}

namespace $ {
  export const container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: var(${Theme.SPACER_16});
    background-color: ${sharedValues.TRANSPARENT_BACKGROUND_COLOR};
    backdrop-filter: ${sharedValues.BACKDROP_FILTER};
    border-bottom: var(${Theme.BORDER_PRIMARY});
    height: ${sharedValues.heights.HEADER_MOBILE}px;
  `
  export const right = styled.div`
    display: flex;
    height: 100%;
  `
  export namespace Right {
    const baseButton = css`
      /* height: ${sharedValues.heights.HEADER_MOBILE}px; */
      display: flex;
      align-items: center;
      justify-content: center;
    `
    export const theme = styled.button`
      ${baseButton}
      padding: 0 var(${Theme.SPACER_8});
      > div > svg {
        height: 24px;
        width: 24px;
      }
    `
    export const hamburger = styled.button`
      ${baseButton}
      padding-right: var(${Theme.SPACER_16});
      padding-left: var(${Theme.SPACER_8});
    `
  }
}
