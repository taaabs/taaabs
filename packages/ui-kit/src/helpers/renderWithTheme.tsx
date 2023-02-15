import { GlobalStyles } from '@/styles/GlobalStyles'
import { render } from '@testing-library/react'

export const renderWithTheme = (children: React.ReactNode) =>
  render(
    <>
      <GlobalStyles />
      {children}
    </>,
  )
