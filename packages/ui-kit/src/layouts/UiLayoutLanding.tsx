import { UiAtoWrapper } from '@/components/atoms/UiAtoWrapper'
import { theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export type UiLayoutLandingProps = {
  children: React.ReactNode
}

export const UiLayoutLanding: React.FC<UiLayoutLandingProps> = (props) => {
  return (
    <>
      <$Container>
        <$Header>
          <UiAtoWrapper>header</UiAtoWrapper>
        </$Header>
        <$Main>{props.children}</$Main>
        <$Footer>
          <UiAtoWrapper>footer</UiAtoWrapper>
        </$Footer>
      </$Container>
    </>
  )
}

const $Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const $Header = styled.header`
  background: ${theme.colors.bgDefault};
  height: 8rem;
`

const $Main = styled.main`
  flex: 1;
`

const $Footer = styled.footer`
  background: red;
`
