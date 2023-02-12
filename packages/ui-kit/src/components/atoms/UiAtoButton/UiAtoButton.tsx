import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import React from 'react'

export type UiAtoButtonProps = {
  href: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  type?: 'submit'
  children?: React.ReactNode
  ariaLabel?: string
  ariaLabelledby?: string
}
export const UiAtoButton: React.FC<UiAtoButtonProps> = ({
  size = 'medium',
  ...props
}) => {
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
  display: inline-block;
  color: red;
  background: blue;
  padding: 1rem 2rem;
`
