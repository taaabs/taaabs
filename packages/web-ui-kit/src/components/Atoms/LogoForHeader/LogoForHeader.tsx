import { sharedValues } from '@/constants'
import { Ui } from '@/index'
import { Theme } from '@/styles/components/GlobalStyles'
import { mq, s } from '@/styles/constants'
import { css } from '@emotion/react'
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
      <_.User.avatarAndUsername href={`/${user.username}`}>
        <Ui.Atoms.ButtonOutlinedIcon
          avatar={user.avatar}
          iconVariant="USER"
          onClick={() => {}}
        />
        <_.User.AvatarAndUsername.username>
          {user.username}
        </_.User.AvatarAndUsername.username>
      </_.User.avatarAndUsername>
    </_.user>
  ) : (
    <_.logo href="/">
      <Ui.Atoms.Icon variant="LOGO" />
      <span>taaabs</span>
    </_.logo>
  )
}

namespace _ {
  const logoTextLetterSpacing = '-1.2px'
  const commonTextStyles = css`
    color: var(${Theme.COLOR_TEXT_NORMAL});
    ${s.fontFamily.plusJakartaSans};
    letter-spacing: ${logoTextLetterSpacing};
  `
  export const user = styled.div`
    display: flex;
    align-items: center;
  `
  export namespace User {
    export const backArrow = styled(Link)`
      display: flex;
      align-items: center;
      padding-right: ${sharedValues.distance[24]}px;
      padding-left: ${sharedValues.distance[16]}px;
      margin-left: calc(${sharedValues.distance[16]}px * -1);
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
        ${s.transition[100]('transform')}
        height: 18px;
        width: 10px;
        ${mq.at992} {
          height: 20px;
          width: 12px;
        }
      }
    `
    export const avatarAndUsername = styled(Link)`
      display: flex;
      align-items: center;
    `
    export namespace AvatarAndUsername {
      export const username = styled.span`
        ${commonTextStyles}
        padding-left: ${sharedValues.distance[12]}px;
        ${s.fontWeight.plusJakartaSans.semiBold}
        ${s.fontSize[20].px}
        margin-bottom: ${sharedValues.distance[1]}px;
        ${mq.at992} {
          ${s.fontSize[22].px}
          margin-bottom: ${sharedValues.distance[2]}px;
        }
      `
    }
  }
  export const logo = styled(Link)`
    display: flex;
    align-items: center;
    > span {
      ${commonTextStyles}
      padding-left: ${sharedValues.distance[10]}px;
      ${s.fontWeight.plusJakartaSans.bold}
      ${s.fontSize[22].px}
      margin-bottom: ${sharedValues.distance[2]}px;
      ${mq.at992} {
        ${s.fontSize[26].px}
        margin-bottom: ${sharedValues.distance[4]}px;
      }
    }
    > div > svg {
      fill: var(${Theme.COLOR_BRAND});
      height: 34px;
      width: auto;
      ${s.transition[100]('fill')}
      ${mq.at992} {
        height: 42px;
      }
    }
  `
}
