import { Atoms } from '@/components'
import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace _Logo {
  export type Props = {
    user?: {
      displayName: string
      backHref: string
    }
  }
}

export const _Logo: React.FC<_Logo.Props> = (props) => {
  return props.user ? (
    <S.user>
      <S.User.backArrow href={props.user.backHref}>
        <Ui.Atoms.Icon variant="LESS_THAN" />
      </S.User.backArrow>
      {props.user.displayName}
    </S.user>
  ) : (
    <S.logo href="/">
      <Atoms.Logo size="small" />
      taaabs
    </S.logo>
  )
}

namespace S {
  const alignment = css`
    display: flex;
    gap: var(${Theme.SPACER_8});
    align-items: center;
    font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
    font-size: var(${Theme.FONT_SIZE_18_PX});
    letter-spacing: -1px;
  `
  export const user = styled.div`
    ${alignment}
  `
  export namespace User {
    export const backArrow = styled(Link)`
      display: flex;
      align-items: center;
      height: ${sharedValues.HEADER_MOBILE_HEIGHT}px;
      padding-right: 24px;
      padding-left: var(${Theme.SPACER_16});
      > div > svg {
        height: 18px;
        width: 10px;
      }
    `
  }
  export const logo = styled(Link)`
    ${alignment}
    padding-left: var(${Theme.SPACER_16});
    padding-right: var(${Theme.SPACER_8});
  `
}
