import { mq } from '@web-ui/styles/constants'
import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'

export namespace SpacerTypes {
  export type Size = 'small' | 'medium' | 'large'
  export type Props = {
    size: Size
  }
}

export const Spacer: React.FC<SpacerTypes.Props> = ({ size }) => {
  return <_.container size={size} />
}

namespace _ {
  type SizeMap = { [Key in SpacerTypes.Size]: SerializedStyles }

  const sizeMap: SizeMap = {
    small: css`
      height: 4rem;
      ${mq.at768} {
        height: 6rem;
      }
      ${mq.at1200} {
        height: 8rem;
      }
    `,
    medium: css`
      height: 4rem;
      ${mq.at768} {
        height: 6rem;
      }
      ${mq.at1200} {
        height: 8rem;
      }
    `,
    large: css`
      height: 6rem;
      ${mq.at768} {
        height: 8rem;
      }
      ${mq.at1200} {
        height: 10rem;
      }
    `,
  }

  export const container = styled.div<Pick<SpacerTypes.Props, 'size'>>`
    ${({ size }) => sizeMap[size]}
  `
}
