import { UiAtoWrapper } from '@/components/atoms/UiAtoWrapper'
import { theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export type UiOrgLandingHeroProps = {
  text: string
}

export const UiOrgLandingHero: React.FC<UiOrgLandingHeroProps> = ({ text }) => {
  return (
    <section>
      <UiAtoWrapper>
        <$Container>
          <h1>{text}</h1>
        </$Container>
      </UiAtoWrapper>
    </section>
  )
}

const $Container = styled.div`
  max-width: 94rem;
  & h1 {
    font-size: 6rem;
    font-family: var(${theme.font.serif});
    line-height: 1.1;
    font-weight: normal;
  }
`
