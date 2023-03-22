import styled from '@emotion/styled'

export namespace DesktopTopNavigationBar {
  export type Props = {
    x?: string
  }
}

export const DesktopTopNavigationBar: React.FC<DesktopTopNavigationBar.Props> =
  (props) => {
    return <S.container>x</S.container>
  }

namespace S {
  export const container = styled.div`
    background-color: red;
    display: flex;
  `
}
