import { theme } from '@/styles/GlobalStyles'
import { css } from '@emotion/react'
import Link from 'next/link'
import React from 'react'

export type UiAtoButtonProps = {
  href?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  type?: 'submit'
  children?: React.ReactNode
  ariaLabel?: string
  ariaLabelledby?: string
}

export const UiAtoButton: React.FC<UiAtoButtonProps> = ({ size = 'medium', ...props }) => {
  if (props.type == 'submit') {
    return (
      <button css={button} type="submit">
        {props.children}
      </button>
    )
  } else if (props.href != undefined) {
    return (
      <Link css={button} href={props.href}>
        {props.children}
      </Link>
    )
  } else if (props.onClick != undefined) {
    return (
      <button css={button} onClick={props.onClick}>
        {props.children}
      </button>
    )
  } else {
    return (
      <button css={button} disabled>
        {props.children}
      </button>
    )
  }
}

const button = css`
  display: inline-flex;
  align-items: center;
  color: var(${theme.colors.white});
  background: var(${theme.colors.accentDefault});
  padding: 0 2rem;
  font-weight: 600;
  border-radius: 0.8rem;
  cursor: pointer;
  height: 4.4rem;
  font-size: 1.6rem;
`
