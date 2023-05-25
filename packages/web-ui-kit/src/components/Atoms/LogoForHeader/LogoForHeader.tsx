import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
import { mq, s } from '@/styles/constants'
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
    <_.user>
      <_.User.backArrow href={user.backHref}>
        <Ui.Atoms.Icon variant="LESS_THAN" />
      </_.User.backArrow>
      <_.User.profile href={`/${user.username}`}>
        <Ui.Atoms.ButtonOutlinedIcon
          avatar={user.avatar}
          iconVariant="USER"
          onClick={() => {}}
        />
        <_.User.Profile.username>@{user.username}</_.User.Profile.username>
      </_.User.profile>
    </_.user>
  ) : (
    <_.logo href="/">
      <Ui.Atoms.Icon variant="LOGO" />
      <span>taaabs</span>
    </_.logo>
  )
}

namespace _ {
  const logoTextLetterSpacing = '-0.06em'

  export const user = styled.div`
    display: flex;
    align-items: center;
  `
  export namespace User {
    export const backArrow = styled(Link)`
      display: flex;
      align-items: center;
      padding-right: ${sharedValues.spacer[24]}px;
      padding-left: ${sharedValues.spacer[16]}px;
      margin-left: calc(${sharedValues.spacer[16]}px * -1);
      ${s.buttonHeight[34]}
      ${mq.at992} {
        ${s.buttonHeight[40]}
      }
      @media (hover: hover) {
        :hover > div > svg {
          transform: translateX(-2px);
        }
      }
      > div > svg {
        fill: var(${Theme.COLOR_BRAND});
        ${s.transition[150]('transform')}
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
        ${s.fontFamily.plusJakartaSans};
        ${s.fontWeight.plusJakartaSans.medium};
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
      ${s.fontFamily.plusJakartaSans};
      ${s.fontWeight.plusJakartaSans.medium};
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
      ${s.transition[150]('fill')}
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
