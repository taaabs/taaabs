import { sharedValues } from '@/constants'
import { mq } from '@/styles/mediaQueries'
import styled from '@emotion/styled'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin: React.FC<MarginProps> = ({ children }) => {
  return <$.container>{children}</$.container>
}

namespace $ {
  export const container = styled.div`
    margin: ${sharedValues.numeric.spacer[16]}px;
    ${mq.at768} {
      margin: ${sharedValues.numeric.spacer[40]}px;
    }
  `
}
