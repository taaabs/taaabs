import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export type SpacerProps = {
  size: 'small' | 'medium' | 'large'
}

export const Spacer: React.FC<SpacerProps> = ({ size }) => {
  return <$Container size={size} />
}

type $ContainerProps = SpacerProps

const $Container = styled.div<$ContainerProps>`
  ${(props) => {
    switch (props.size) {
      case 'small':
        return css`
          height: 4rem;
          ${mq.at768(css`
            height: 6rem;
          `)}
          ${mq.at1200(css`
            height: 8rem;
          `)}
        `
      case 'medium':
        return css`
          height: 4rem;
          ${mq.at768(css`
            height: 6rem;
          `)}
          ${mq.at1200(css`
            height: 8rem;
          `)}
        `
      case 'large':
        return css`
          height: 6rem;
          ${mq.at768(css`
            height: 8rem;
          `)}
          ${mq.at1200(css`
            height: 10rem;
          `)}
        `
    }
  }}
`