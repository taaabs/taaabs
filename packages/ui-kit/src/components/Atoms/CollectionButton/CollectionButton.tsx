import { Theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
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
  border-style: solid;
  border-width: 1px;
  border-color: var(${Theme.COLOR_200});
  color: var(${Theme.COLOR_TEXT});
  font-weight: 600;
  cursor: pointer;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: var(${Theme.TRANSITION_HOVER});
  font-size: 1.4rem;
  height: 4rem;
  padding: 0 1.2rem;
  will-change: border;
  ${mq.at768} {
    font-size: 1.6rem;
    height: 4.8rem;
    padding: 0 1.6rem;
  }
  &:after {
    background-color: var(${Theme.COLOR_100});
    border-radius: calc(var(${Theme.BORDER_RADIUS_4}) + 1px);
    content: '';
    right: -1px;
    bottom: -1px;
    width: 100%;
    position: absolute;
    transition: var(${Theme.TRANSITION_HOVER});
    z-index: -1;
    height: 4rem;
    transform: translate(2px, 2px);
    will-change: transform;
    ${mq.at768} {
      height: 4.6rem;
    }
  }
  &:hover {
    border-color: var(${Theme.COLOR_100});
    &:after {
      ${mq.at768} {
        transform: translate(0, 0);
      }
    }
  }
`
