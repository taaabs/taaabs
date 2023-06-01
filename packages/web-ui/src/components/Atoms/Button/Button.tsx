import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { s } from '@web-ui/styles/constants'
import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace Button {
  export type Size = 'small' | 'default' | 'large'
  export type Props = {
    href?: string
    size?: Size
    onClick?: () => void
    type?: 'submit'
    children?: React.ReactNode
    ariaLabel?: string
    ariaLabelledby?: string
  }
}

export const Button: React.FC<Button.Props> = (props) => {
  if (props.type == 'submit') {
    return (
      <_.button size={props.size} type="submit">
        {props.children}
      </_.button>
    )
  } else if (props.href != undefined) {
    return (
      <_.nextLink size={props.size} href={props.href} onClick={props.onClick}>
        {props.children}
      </_.nextLink>
    )
  } else if (props.onClick != undefined) {
    return (
      <_.button size={props.size} onClick={props.onClick}>
        {props.children}
      </_.button>
    )
  } else {
    return (
      <_.button size={props.size} disabled>
        {props.children}
      </_.button>
    )
  }
}

namespace _ {
  const buttonBase = css`
    display: inline-flex;
    align-items: center;
    color: var(${Theme.COLOR_WHITE});
    background: var(${Theme.COLOR_BRAND});
    ${s.fontWeight.inter.medium};
    &:hover {
      background: var(${Theme.COLOR_PRIMARY_900});
    }
  `
  type SizeMap = {
    [Key in Button.Size]: SerializedStyles
  }
  const sizeMap: SizeMap = {
    small: css`
      ${s.buttonHeight[34]};
      ${s.fontSize[15].px};
      padding: 0 10px;
      ${s.borderRadius[8]}
    `,
    default: css`
      ${s.buttonHeight[40]};
      ${s.fontSize[16].px};
      padding: 0 14px;
      ${s.borderRadius[10]}
    `,
    large: css`
      ${s.buttonHeight[46]};
      padding: 0 18px;
      ${s.borderRadius[12]}
      ${s.fontSize[17].px};
    `,
  }

  type ButtonProps = Pick<Button.Props, 'size'>

  export const button = styled.button<ButtonProps>`
    ${buttonBase}
    ${({ size = 'default' }) => sizeMap[size]}
  `
  export const nextLink = styled(Link)<ButtonProps>`
    ${buttonBase}
    ${({ size = 'default' }) => sizeMap[size]}
  `
}
