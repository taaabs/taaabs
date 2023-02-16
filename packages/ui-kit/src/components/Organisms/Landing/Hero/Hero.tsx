import { Atoms } from '@/components'
import { theme } from '@/styles/GlobalStyles'
import { mq } from '@/styles/mediaQueries'
import styled, { css } from 'styled-components'

export type HeroProps = {
  text: string
}

export const Hero: React.FC<HeroProps> = ({ text }) => {
  return (
    <section>
      <Atoms.Wrapper>
        <$Container>
          <h1>{text}</h1>
        </$Container>
      </Atoms.Wrapper>
    </section>
  )
}

const $Container = styled.div`
  ${mq.at768(css`
    max-width: 90%;
  `)}
  ${mq.at992(css`
    max-width: 110rem;
  `)}
  & h1 {
    font-size: 4rem;
    font-family: var(${theme.fontFamily.serif});
    line-height: 1.1;
    font-weight: normal;
    ${mq.at768(css`
      font-size: 5rem;
    `)}
    ${mq.at992(css`
      font-size: 5.5rem;
    `)}
    ${mq.at1200(css`
      font-size: 6.5rem;
    `)}
  }
`
