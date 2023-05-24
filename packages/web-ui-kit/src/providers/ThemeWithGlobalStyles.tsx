import { globalStyles } from '@/styles/components/GlobalStyles'
import { Global } from '@emotion/react'

interface ThemeWithGlobalStylesProps {
  children: React.ReactNode
}

export const ThemeWithGlobalStylesProvider: React.FC<
  ThemeWithGlobalStylesProps
> = ({ children }) => {
  return (
    <>
      <Global styles={globalStyles} />
      {children}
    </>
  )
}
