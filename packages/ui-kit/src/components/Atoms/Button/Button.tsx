import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { ButtonTypes } from './Button.types'

export const Button: React.FC<ButtonTypes.Props> = (props) => {
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
  const base = css`
    display: inline-flex;
    align-items: center;
    color: var(${Theme.COLOR_WHITE});
    background: var(${Theme.COLOR_ACCENT});
    font-weight: 600;
    transition: var(${Theme.ANIMATION_DURATION_150});
    &:hover {
      transform: translateY(-2px);
    }
  `
  const sizeMap: ButtonTypes.SizeMap = {
    [ButtonTypes.Size.DEFAULT]: css`
      height: 4.8rem;
      font-size: var(${Theme.FONT_SIZE_BODY_16});
      padding: 0 2rem;
      border-radius: var(${Theme.BORDER_RADIUS_10});
    `,
    [ButtonTypes.Size.LARGE]: css`
      padding: 0 2.2rem;
      border-radius: var(${Theme.BORDER_RADIUS_12});
      height: 5.6rem;
      font-size: var(${Theme.FONT_SIZE_BODY_18});
      ${mq.at1200} {
        height: 6rem;
        padding: 0 2.8rem;
        font-size: var(${Theme.FONT_SIZE_BODY_20});
        border-radius: var(${Theme.BORDER_RADIUS_14});
      }
    `,
  }
  type ButtonProps = {
    size?: ButtonTypes.Size
  }
  export const Button = styled.button<ButtonProps>`
    ${base}
    ${({ size = ButtonTypes.Size.DEFAULT }) => sizeMap[size]}
    cursor: pointer;
  `
  export const NextLink = styled(Link)<ButtonProps>`
    ${base}
    ${({ size = ButtonTypes.Size.DEFAULT }) =>
      sizeMap[size || ButtonTypes.Size.DEFAULT]}
  `
}
