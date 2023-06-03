import { sharedValues } from '@web-ui/constants'
import { mq } from '@web-ui/styles/constants'
import styled from '@emotion/styled'

type MarginProps = {
  children?: React.ReactNode
}

export const StorybookMargin = (props: MarginProps) => {
  return <_.container>{props.children}</_.container>
}

namespace _ {
  export const container = styled.div`
    margin: ${sharedValues.distance[16]}px;
    ${mq.at768} {
      margin: ${sharedValues.distance[40]}px;
    }
  `
}
