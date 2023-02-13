import { GlobalStyles } from '@/styles/GlobalStyles'

interface ThemeWithGlobalStylesProps {
  children: React.ReactNode
}

export const ThemeWithGlobalStylesProvider: React.FC<ThemeWithGlobalStylesProps> = ({
  children,
}) => {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  )
}
