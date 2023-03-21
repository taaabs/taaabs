import { mq } from '@/styles/mediaQueries'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

export type WrapperProps = {
  children?: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = (props) => {
  return <$Container>{props.children}</$Container>
}

const $Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  max-width: 1280px;
  ${mq.at768} {
    padding: 0 40px;
  }
`
