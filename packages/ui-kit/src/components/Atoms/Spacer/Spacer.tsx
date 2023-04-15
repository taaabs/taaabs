import { mq } from '@/styles/mediaQueries'
import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'

export namespace Spacer {
  export type Size = 'small' | 'medium' | 'large'
  export type Props = {
    size: Size
  }
}

export const Spacer: React.FC<Spacer.Props> = ({ size }) => {
  return <$.container size={size} />
}

namespace $ {
  type SizeMap = { [Key in Spacer.Size]: SerializedStyles }

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

  export const container = styled.div<Pick<Spacer.Props, 'size'>>`
    ${({ size }) => sizeMap[size]}
  `
}
