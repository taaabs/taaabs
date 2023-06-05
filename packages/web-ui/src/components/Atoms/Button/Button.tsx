import { Theme } from '@web-ui/styles/components/GlobalStyles'
import { styles } from '@web-ui/styles/constants'
import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

export namespace ButtonTypes {
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

export const Button = (props: ButtonTypes.Props) => {
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
    flex-shrink: 0;
    color: var(${Theme.COLOR_WHITE});
    background: var(${Theme.BUTTON_BACKGROUND});
    ${styles.fontWeight.inter.medium};
    ${styles.transition[100]('background')}
    &:hover {
      background: var(${Theme.BUTTON_BACKGROUND_HOVER});
    }
  `
  type SizeMap = {
    [Key in ButtonTypes.Size]: SerializedStyles
  }
  const sizeMap: SizeMap = {
    small: css`
      ${styles.buttonHeight[34]};
      ${styles.fontSize[15].px};
      padding: 0 10px;
      ${styles.borderRadius[8]}
    `,
    default: css`
      ${styles.buttonHeight[40]};
      ${styles.fontSize[16].px};
      padding: 0 14px;
      ${styles.borderRadius[10]}
    `,
    large: css`
      ${styles.buttonHeight[46]};
      padding: 0 18px;
      ${styles.borderRadius[12]}
      ${styles.fontSize[17].px};
    `,
  }

  type ButtonProps = Pick<ButtonTypes.Props, 'size'>

  export const button = styled.button<ButtonProps>`
    ${buttonBase}
    ${({ size = 'default' }) => sizeMap[size]}
  `
  export const nextLink = styled(Link)<ButtonProps>`
    ${buttonBase}
    ${({ size = 'default' }) => sizeMap[size]}
  `
}
