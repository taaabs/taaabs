import { UiAtoWrapper } from '@/components/atoms/UiAtoWrapper'
import { theme } from '@/styles/GlobalStyles'
import styled from '@emotion/styled'

export type UiLayoutLandingProps = {
  children?: React.ReactNode
  logIn: {
    onClick: () => void
    label: string
  }
  getStarted: {
    onClick: () => void
    label: string
  }
}

export const UiLayoutLanding: React.FC<UiLayoutLandingProps> = (props) => {
  return (
    <$Container>
      <$Header.outer>
        <UiAtoWrapper>
          <$Header.inner>
            <div>logo11</div>
            <$Header.actionButtons>
              <div onClick={props.logIn.onClick}>{props.logIn.label}</div>
              <div onClick={props.getStarted.onClick}>{props.getStarted.label}</div>
            </$Header.actionButtons>
          </$Header.inner>
        </UiAtoWrapper>
      </$Header.outer>
      <$Main>{props.children}</$Main>
      <$Footer>
        <UiAtoWrapper>footer</UiAtoWrapper>
      </$Footer>
    </$Container>
  )
}

const $Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const $Header = {
  outer: styled.header`
    display: flex;
    background: var(${theme.colors.gray100});
    height: 8rem;
    align-items: center;
  `,
  inner: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  actionButtons: styled.div`
    display: flex;
    gap: 1.5rem;
  `,
}

const $Main = styled.main`
  flex: 1;
`

const $Footer = styled.footer`
  background: red;
`
