import { Theme } from '@/styles/GlobalStyles'
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
      <S.Button size={props.size} type="submit">
        {props.children}
      </S.Button>
    )
  } else if (props.href != undefined) {
    return (
      <S.NextLink size={props.size} href={props.href} onClick={props.onClick}>
        {props.children}
      </S.NextLink>
    )
  } else if (props.onClick != undefined) {
    return (
      <S.Button size={props.size} onClick={props.onClick}>
        {props.children}
      </S.Button>
    )
  } else {
    return (
      <S.Button size={props.size} disabled>
        {props.children}
      </S.Button>
    )
  }
}

namespace S {
  const buttonBase = css`
    display: inline-flex;
    align-items: center;
    color: var(${Theme.COLOR_WHITE});
    background: var(${Theme.COLOR_BRAND});
    font-weight: var(${Theme.FONT_WEIGHT_INTER_MEDIUM});
    &:hover {
      background: var(${Theme.COLOR_PRIMARY_900});
    }
  `
  type SizeMap = {
    [Key in Button.Size]: SerializedStyles
  }
  const sizeMap: SizeMap = {
    small: css`
      height: var(${Theme.BUTTON_HEIGHT_34});
      font-size: var(${Theme.FONT_SIZE_14_PX});
      padding: 0 10px;
      border-radius: var(${Theme.BORDER_RADIUS_8});
    `,
    default: css`
      height: var(${Theme.BUTTON_HEIGHT_40});
      font-size: var(${Theme.FONT_SIZE_16_PX});
      padding: 0 14px;
      border-radius: var(${Theme.BORDER_RADIUS_10});
    `,
    large: css`
      height: var(${Theme.BUTTON_HEIGHT_46});
      padding: 0 18px;
      border-radius: var(${Theme.BORDER_RADIUS_12});
      font-size: var(${Theme.FONT_SIZE_18_PX});
    `,
  }

  type ButtonProps = Pick<Button.Props, 'size'>

  export const Button = styled.button<ButtonProps>`
    ${buttonBase}
    ${({ size = 'default' }) => sizeMap[size]}
  `
  export const NextLink = styled(Link)<ButtonProps>`
    ${buttonBase}
    ${({ size = 'default' }) => sizeMap[size]}
  `
}
