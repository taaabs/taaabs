import { sharedValues } from '@/constants'
import { mq } from '@/styles/constants'
import styled from '@emotion/styled'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin: React.FC<MarginProps> = ({ children }) => {
  return <$.container>{children}</$.container>
}

namespace $ {
  export const container = styled.div`
    margin: ${sharedValues.spacer[16]}px;
    ${mq.at768} {
      margin: ${sharedValues.spacer[40]}px;
    }
  `
}
