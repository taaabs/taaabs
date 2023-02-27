import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { CollectionButtonTypes } from './CollectionButton.types'

export const CollectionButton: React.FC<CollectionButtonTypes.Props> = ({
  href,
  children,
}) => {
  return (
    <Link css={link} href={href}>
      {children}
    </Link>
  )
}

const link = css`
  display: inline-flex;
  align-items: center;
  background-color: var(${Theme.COLOR_WHITE});
  border-radius: var(${Theme.BORDER_RADIUS_4});
  color: var(${Theme.COLOR_TEXT});
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
  &:hover {
    color: var(${Theme.COLOR_ACCENT});
  }
  &:after {
    background-color: var(${Theme.COLOR_100});
    border-radius: calc(var(${Theme.BORDER_RADIUS_4}) * 1.3);
    content: '';
    left: 0;
    width: 100%;
    position: absolute;
    transition: transform 0.15s ease-in-out;
    z-index: -1;
    height: 4rem;
    transform: translate(3px, 3px);
    will-change: transform;
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
