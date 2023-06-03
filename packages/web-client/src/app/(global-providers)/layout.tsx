'use client'

import { ThemeWithGlobalStylesProvider } from '@web-ui/providers/ThemeWithGlobalStyles'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeWithGlobalStylesProvider>{children}</ThemeWithGlobalStylesProvider>
  )
}
