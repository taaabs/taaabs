import { Atoms } from '@/components'
import { Theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace _Logo {
  export type Props = {
    username?: string
  }
}

export const _Logo: React.FC<_Logo.Props> = (props) => {
  return props.username ? (
    <S.container>
      <Link href="/">
        <Atoms.Logo />
      </Link>
      @{props.username}
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
  export const container = styled.div`
    ${alignment}
  `
  export const link = styled(Link)`
    ${alignment}
  `
}
