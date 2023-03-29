import { Icon } from '@/components/Atoms'
import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { _Logo } from './_Logo'

export namespace HeaderMobile {
  export type Props = {
    hamburgerIsToggled: boolean
    onClickHamburger: () => void
    onClickTheme: () => void
    currentTheme: 'LIGHT' | 'DARK'
  } & _Logo.Props
}

export const HeaderMobile: React.FC<HeaderMobile.Props> = (props) => {
  return (
    <S.container>
      <_Logo user={props.user} />
      <S.right>
        <S.Right.theme onClick={props.onClickTheme}>
          <Icon variant="SUN" />
        </S.Right.theme>
        <S.Right.hamburger onClick={props.onClickHamburger}>
          <Ui.Atoms.Hamburger isToggled={props.hamburgerIsToggled} />
        </S.Right.hamburger>
      </S.right>
    </S.container>
  )
}

namespace S {
  export const container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `
  export const right = styled.div`
    display: flex;
  `
  export namespace Right {
    const baseButton = css`
      height: ${sharedValues.HEADER_MOBILE_HEIGHT}px;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    export const theme = styled.button`
      ${baseButton}
      padding: 0 var(${Theme.SPACER_8});
      > div > svg {
        height: 20px;
        width: 20px;
      }
    `
    export const hamburger = styled.button`
      ${baseButton}
      padding-right: var(${Theme.SPACER_16});
      padding-left: var(${Theme.SPACER_8});
    `
  }
}
