import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Link from 'next/link'

export const LogoForHeader: React.FC = () => {
  return (
    <S.logo href="/">
      <Ui.Atoms.Icon variant="LOGO" />
      <S.Logo.text>
        <S.Logo.Text.topLine>taaabs</S.Logo.Text.topLine>
        <S.Logo.Text.bottomLine>free social bookmarking</S.Logo.Text.bottomLine>
      </S.Logo.text>
    </S.logo>
  )
}

namespace S {
  export const logo = styled(Link)`
    display: flex;
    gap: 8px;
    align-items: center;
    > div > svg {
      fill: var(${Theme.COLOR_PRIMARY_800});
      height: 36px;
      width: auto;
      transition: fill var(${Theme.ANIMATION_DURATION_150})
        var(${Theme.TRANSITION_TIMING_FUNCTION});
      ${mq.at992} {
        height: 42px;
      }
      @media (hover: hover) {
        :hover {
          fill: var(${Theme.COLOR_PRIMARY_900});
        }
      }
    }
  `
  export namespace Logo {
    export const text = styled.div`
      display: flex;
      flex-direction: column;
      line-height: 1em;
      ${mq.at992} {
        line-height: 1.1em;
      }
    `
    export namespace Text {
      export const topLine = styled.div`
        font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
        font-weight: var(${Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM});
        color: var(${Theme.COLOR_PRIMARY_800});
        font-size: 18px;
        letter-spacing: -1.2px;
        ${mq.at992} {
          font-size: 22px;
        }
        @media (hover: hover) {
          :hover {
            text-decoration: underline;
            text-decoration-thickness: 1.5px;
            text-underline-offset: 1.5px;
          }
        }
      `
      export const bottomLine = styled.div`
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding-right: 2px;
        color: var(${Theme.COLOR_TEXT_DIMMED});
        letter-spacing: -0.03em;
        font-size: 11px;
        margin-left: 2px;
        ${mq.at992} {
          font-size: 12px;
          margin-left: 2.5px;
        }
      `
    }
  }
}
