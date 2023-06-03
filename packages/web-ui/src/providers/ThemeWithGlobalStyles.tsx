import { globalStyles } from '@web-ui/styles/components/GlobalStyles'
import { Global } from '@emotion/react'

interface ThemeWithGlobalStylesProps {
  children: React.ReactNode
}

export const ThemeWithGlobalStylesProvider = (
  props: ThemeWithGlobalStylesProps,
) => {
  return (
    <>
      <Global styles={globalStyles} />
      {props.children}
    </>
  )
}
