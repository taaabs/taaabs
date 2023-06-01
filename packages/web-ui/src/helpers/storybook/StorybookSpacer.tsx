import { sharedValues } from '@web-ui/constants'
import { mq } from '@web-ui/styles/constants'
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
