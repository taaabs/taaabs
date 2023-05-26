import { sharedValues } from '@/constants'
import { mq } from '@/styles/constants'
import styled from '@emotion/styled'

export const StorybookSpacer: React.FC = () => {
  return <_.container />
}

namespace _ {
  export const container = styled.div`
    height: ${sharedValues.distance[16]}px;
    ${mq.at768} {
      height: ${sharedValues.distance[40]}px;
    }
  `
}
