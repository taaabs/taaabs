import { Atoms } from '@/components'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace _Logo {
  export type Props = {
    userDisplayName?: string
  }
}

export const _Logo: React.FC<_Logo.Props> = (props) => {
  return props.userDisplayName ? (
    <S.container>
      <Link href="/">
        <Atoms.Logo />
      </Link>
      {props.userDisplayName}
    </S.container>
  ) : (
    <S.link href="/">
      <Atoms.Logo />
      taaabs
    </S.link>
  )
}

namespace S {
  const alignment = css`
    display: flex;
    gap: var(${Theme.SPACER_8});
    align-items: center;
    font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
    font-size: var(${Theme.FONT_SIZE_20_REM});
    letter-spacing: -1.5px;
  `
  const logoHoverState = css`
    > div {
      transition: var(${Theme.TRANSITION_HOVER});
    }
    @media (hover: hover) {
      :hover > div {
        background-color: var(${Theme.COLOR_PRIMARY_900});
      }
    }
  `
  export const container = styled.div`
    ${alignment}
    > a {
      ${logoHoverState}
    }
  `
  export const link = styled(Link)`
    ${alignment}
    ${logoHoverState}
  `
}
