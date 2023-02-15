import { mq } from '@/styles/mediaQueries'
import { css } from 'styled-components'
import styled from 'styled-components'

export type WrapperProps = {
  children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return <$Container>{props.children}</$Container>
}

const $Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  max-width: 125rem;
  ${mq.at768(css`
    padding: 0 4rem;
  `)}
`
