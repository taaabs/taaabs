import { Atoms } from '@/components'
import { theme } from '@/styles/GlobalStyles'
import styled from 'styled-components'

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
  max-width: 98rem;
  & h1 {
    font-size: 6rem;
    font-family: var(${theme.font.serif});
    line-height: 1.1;
    font-weight: normal;
  }
`
