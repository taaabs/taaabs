import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import Link from 'next/link'

export type UiAtoCollectionButtonProps = {
  href: string
  children?: React.ReactNode
}

export const UiAtoCollectionButton: React.FC<UiAtoCollectionButtonProps> = ({ href, children }) => {
  return (
    <Link href={href} css={[button]}>
      {children}
    </Link>
  )
}

const button = css`
  display: inline-flex;
  align-items: center;
  background-color: var(${theme.colors.white});
  border-radius: 4px;
  color: var(${theme.colors.text});
  font-weight: 600;
  cursor: pointer;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  font-size: 1.4rem;
  height: 4rem;
  padding: 0 1.2rem;
  ${mq.at768(css`
    font-size: 1.6rem;
    height: 4.8rem;
    padding: 0 1.6rem;
  `)}
  &:after {
    background-color: var(${theme.colors.default100});
    border-radius: 4.7px;
    content: '';
    left: 0;
    width: 100%;
    position: absolute;
    transition: transform 0.15s ease-in-out;
    z-index: -1;
    height: 4rem;
    transform: translate(3px, 3px);
    ${mq.at768(css`
      height: 4.8rem;
      transform: translate(4px, 4px);
    `)}
  }
  &:hover:after {
    ${mq.at768(css`
      transform: translate(2px, 2px);
    `)}
  }
`
