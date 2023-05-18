import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace LogoForHeader {
  export type User = {
    username: string
    avatar?: {
      url: string
      blurhash: string
    }
    backHref: string
  }
  export type Props = {
    user?: User
  }
}

export const LogoForHeader: React.FC<LogoForHeader.Props> = ({ user }) => {
  return user ? (
    <$.user>
      <$.User.backArrow href={user.backHref}>
        <Ui.Atoms.Icon variant="LESS_THAN" />
      </$.User.backArrow>
      <$.User.profile href={`/${user.username}`}>
        <Ui.Atoms.ButtonOutlinedIcon
          avatar={user.avatar}
          iconVariant="USER"
          onClick={() => {}}
        />
        <$.User.Profile.username>@{user.username}</$.User.Profile.username>
      </$.User.profile>
    </$.user>
  ) : (
    <$.logo href="/">
      <Ui.Atoms.Icon variant="LOGO" />
      <span>taaabs</span>
    </$.logo>
  )
}

namespace $ {
  const logoTextLetterSpacing = '-0.06em'

  export const user = styled.div`
    display: flex;
    align-items: center;
  `
  export namespace User {
    export const backArrow = styled(Link)`
      display: flex;
      align-items: center;
      padding-right: ${sharedValues.numeric.spacer[24]}px;
      padding-left: ${sharedValues.numeric.spacer[16]}px;
      margin-left: calc(${sharedValues.numeric.spacer[16]}px * -1);
      ${sharedValues.styles.buttonHeight[34]}
      ${mq.at992} {
        ${sharedValues.styles.buttonHeight[40]}
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
    `
    export namespace Profile {
      export const username = styled.span`
        ${sharedValues.styles.fontFamily.spaceGrotesk};
        font-weight: var(${Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM});
        letter-spacing: ${logoTextLetterSpacing};
        color: var(${Theme.COLOR_BRAND});
        padding-left: 0.4em;
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
    align-items: center;
    > span {
      color: var(${Theme.COLOR_BRAND});
      ${sharedValues.styles.fontFamily.spaceGrotesk};
      font-weight: var(${Theme.FONT_SPACE_GROTESK_WEIGHT_MEDIUM});
      font-size: 22px;
      letter-spacing: ${logoTextLetterSpacing};
      padding-left: 0.3em;
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
