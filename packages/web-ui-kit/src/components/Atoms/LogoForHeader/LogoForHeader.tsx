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
      <_.User.profile href={`/${user.username}`}>
        <Ui.Atoms.ButtonOutlinedIcon
          avatar={user.avatar}
          iconVariant="USER"
          onClick={() => {}}
        />
        <_.User.Profile.username>{user.username}</_.User.Profile.username>
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
  const commonTextStyles = css`
    color: var(${Theme.COLOR_TEXT_NORMAL});
    ${s.fontFamily.plusJakartaSans};
    ${s.fontWeight.plusJakartaSans.bold};
    ${s.fontSize[22].px}
    letter-spacing: ${logoTextLetterSpacing};
    padding-left: ${sharedValues.distance[8]}px;
    padding-bottom: ${sharedValues.distance[3]}px;
    ${mq.at992} {
      ${s.fontSize[26].px}
    }
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
    export const profile = styled(Link)`
      display: flex;
      align-items: center;
    `
    export namespace Profile {
      export const username = styled.span`
        ${commonTextStyles}
      `
    }
  }
  export const logo = styled(Link)`
    display: flex;
    align-items: center;
    > span {
      ${commonTextStyles}
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
