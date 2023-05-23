import { sharedValues } from '@/constants'
import { Theme } from '@/styles/components/GlobalStyles'
import styled from '@emotion/styled'
import { Icon } from '../Icon'
import { s } from '@/styles/constants'

export namespace ButtonOutlinedText {
  export type Props = {
    children?: React.ReactNode
    onClick: () => void
  }
}

export const ButtonFollow: React.FC<ButtonOutlinedText.Props> = (props) => {
  return (
    <$.button onClick={props.onClick}>
      <Icon variant="USER_ADD" />
      <span>{props.children}</span>
    </$.button>
  )
}

namespace $ {
  export const button = styled.button`
    display: flex;
    align-items: center;
    ${s.buttonHeight[34]}
    ${s.borderRadius[999]}
    border: var(${Theme.BORDER_SECONDARY});
    padding: 0 ${sharedValues.spacer[12]}px;
    gap: ${sharedValues.spacer[8]}px;
    > div > svg {
      height: 17px;
    }
    @media (hover: hover) {
      :hover {
        background-color: var(${Theme.COLOR_NEUTRAL_50});
        border-color: var(${Theme.COLOR_BORDER_PRIMARY});
      }
    }
    span {
      ${s.fontWeight.inter.medium};
    }
  `
}
