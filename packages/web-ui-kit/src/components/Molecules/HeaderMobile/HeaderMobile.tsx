import { Icon, LogoForHeader } from '@/components/Atoms'
import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
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
    <_.container>
      <Ui.Atoms.LogoForHeader user={props.viewedUser} />
      <_.right>
        <_.Right.theme onClick={props.onClickTheme}>
          <Icon variant="SUN" />
        </_.Right.theme>
        <_.Right.hamburger onClick={props.onClickHamburger}></_.Right.hamburger>
      </_.right>
    </_.container>
  )
}

namespace _ {
  export const container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: ${sharedValues.distance[16]}px;
    border-bottom: var(${Theme.BORDER_PRIMARY});
    height: ${sharedValues.headerMobile}px;
    background-color: var(${Theme.HEADER_BACKGROUND});
  `
  export const right = styled.div`
    display: flex;
    height: 100%;
  `
  export namespace Right {
    const baseButton = css`
      height: ${sharedValues.headerMobile}px;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    export const theme = styled.button`
      ${baseButton}
      padding: 0 ${sharedValues.distance[8]}px;
      > div > svg {
        height: 24px;
        width: 24px;
      }
    `
    export const hamburger = styled.button`
      ${baseButton}
      padding-right: ${sharedValues.distance[16]}px;
      padding-left: ${sharedValues.distance[8]}px;
    `
  }
}
