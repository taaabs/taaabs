'use client'

import { GlobalStylesProvider } from '@web-ui/providers/GlobalStylesProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalStylesProvider>{children}</GlobalStylesProvider>
  )
}
