import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export const UiAtoSpacer: React.FC = () => {
  return <$Container />
}

const $Container = styled.div`
  height: 4rem;
  ${mq.at768(css`
    height: 6rem;
  `)}
  ${mq.at1200(css`
    height: 8rem;
  `)}
`
