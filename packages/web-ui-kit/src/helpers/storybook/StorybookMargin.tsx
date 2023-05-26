import { sharedValues } from '@/constants'
import { mq } from '@/styles/constants'
import styled from '@emotion/styled'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin: React.FC<MarginProps> = ({ children }) => {
  return <_.container>{children}</_.container>
}

namespace _ {
  export const container = styled.div`
    margin: ${sharedValues.distance[16]}px;
    ${mq.at768} {
      margin: ${sharedValues.distance[40]}px;
    }
  `
}
