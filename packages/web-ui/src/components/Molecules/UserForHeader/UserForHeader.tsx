import { sharedValues } from '@web-ui/constants'
import { Ui } from '@web-ui/index'
import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { mq, s } from '@web-ui/styles/constants'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace UserForHeader {
  export type User = {
    username: string
    avatar?: {
      url: string
      blurhash: string
    }
    backHref: string
  }
  export type Props = {
    user: User
  }
}

export const UserForHeader: React.FC<UserForHeader.Props> = ({ user }) => {
  return (
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
  )
}

namespace _ {
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
        color: var(${Theme.COLOR_TEXT_NORMAL});
        ${s.fontFamily.plusJakartaSans};
        ${s.letterSpacing.logo};
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
}
