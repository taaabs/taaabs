import { theme } from '@/styles/GlobalStyles'
import styled, { css } from 'styled-components'
import Link from 'next/link'

export type UiAtoButtonProps = {
  href?: string
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
    return <$Button type="submit">{props.children}</$Button>
  } else if (props.href != undefined) {
    return <$Link href={props.href}>{props.children}</$Link>
  } else if (props.onClick != undefined) {
    return <$Button onClick={props.onClick}>{props.children}</$Button>
  } else {
    return <$Button disabled>{props.children}</$Button>
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

const $Button = styled.button`
  ${button}
  cursor: pointer;
`

const $Link = styled(Link)`
  ${button}
`
