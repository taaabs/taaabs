import { theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import Link from 'next/link'

export type ButtonProps = {
  href?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  type?: 'submit'
  children?: React.ReactNode
  ariaLabel?: string
  ariaLabelledby?: string
}

export const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  ...props
}) => {
  if (props.type == 'submit') {
    return <Styled.Button type="submit">{props.children}</Styled.Button>
  } else if (props.href != undefined) {
    return <Styled.Link href={props.href}>{props.children}</Styled.Link>
  } else if (props.onClick != undefined) {
    return (
      <Styled.Button onClick={props.onClick}>{props.children}</Styled.Button>
    )
  } else {
    return <Styled.Button disabled>{props.children}</Styled.Button>
  }
}

const button = css`
  display: inline-flex;
  align-items: center;
  color: var(${theme.colors.white});
  background: var(${theme.colors.accent});
  padding: 0 2rem;
  font-weight: 600;
  border-radius: 0.8rem;
  height: 4.8rem;
  font-size: 1.6rem;
`

const Styled = {
  Button: styled.button`
    ${button}
    cursor: pointer;
  `,
  Link: styled(Link)`
    ${button}
  `,
}
