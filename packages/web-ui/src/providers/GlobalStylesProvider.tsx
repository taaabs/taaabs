import { globalStyles } from '@web-ui/styles/components/GlobalStyles'
import { Global } from '@emotion/react'

namespace GlobalStylesProviderTypes {
  export type Props = {
    children: React.ReactNode
  }
}

export const GlobalStylesProvider: React.FC<GlobalStylesProviderTypes.Props> = (
  props,
) => {
  return (
    <>
      <Global styles={globalStyles} />
      {props.children}
    </>
  )
}
