import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace LogoForHeader {
  export type Props = {
    user?: {
      username: string
      avatar?: {
        url: string
        blurhash: string
      }
      backHref: string
    }
  }
}

export const LogoForHeader: React.FC<LogoForHeader.Props> = ({ user }) => {
  return user ? (
    <S.user>
      <S.User.backArrow href={user.backHref}>
        <Ui.Atoms.Icon variant="LESS_THAN" />
      </S.User.backArrow>
      <S.User.profile href={`/${user.username}`}>
        <Ui.Atoms.ButtonCircle
          blurhash={user.avatar?.blurhash}
          imageUrl={user.avatar?.url}
          iconVariant="USER"
        />
        <S.User.Profile.username>@{user.username}</S.User.Profile.username>
      </S.User.profile>
    </S.user>
  ) : (
    <S.logo href="/">
      <Ui.Atoms.Icon variant="LOGO" />
      <span>taaabs</span>
    </S.logo>
  )
}

namespace S {
  const logoTextLetterSpacing = '-0.06em'

  export const user = styled.div`
    display: flex;
    align-items: center;
  `
  export namespace User {
    export const backArrow = styled(Link)`
      display: flex;
      align-items: center;
      padding-right: var(${Theme.SPACER_24});
      padding-left: var(${Theme.SPACER_16});
      margin-left: calc(var(${Theme.SPACER_16}) * -1);
      height: var(${Theme.BUTTON_HEIGHT_34});
      ${mq.at992} {
        height: var(${Theme.BUTTON_HEIGHT_40});
      }
      @media (hover: hover) {
        :hover > div > svg {
          transform: translateX(-2px);
        }
      }
      > div > svg {
        fill: var(${Theme.COLOR_BRAND});
        transition: transform var(${Theme.ANIMATION_DURATION_150})
          var(${Theme.ANIMATION_DURATION_150});
        height: 18px;
        width: 10px;
        ${mq.at992} {
          height: 20px;
          width: 12px;
        }
      }
    `
    export const profile = styled(Link)`
      display: flex;
      align-items: center;
      gap: var(${Theme.SPACER_8});
    `
    export namespace Profile {
      export const username = styled.span`
        font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
        font-weight: var(${Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM});
        letter-spacing: ${logoTextLetterSpacing};
        color: var(${Theme.COLOR_BRAND});
        font-size: 18px;
        ${mq.at992} {
          font-size: 22px;
        }
        @media (hover: hover) {
          :hover {
            text-decoration: underline;
          }
        }
      `
    }
  }
  export const logo = styled(Link)`
    display: flex;
    gap: var(${Theme.SPACER_8});
    align-items: center;
    > span {
      color: var(${Theme.COLOR_BRAND});
      font-family: var(${Theme.FONT_FAMILY_SPACE_GROTESK});
      font-weight: var(${Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM});
      font-size: 20px;
      letter-spacing: ${logoTextLetterSpacing};
      ${mq.at992} {
        font-size: 24px;
      }
      @media (hover: hover) {
        :hover {
          text-decoration: underline;
        }
      }
    }
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
}
