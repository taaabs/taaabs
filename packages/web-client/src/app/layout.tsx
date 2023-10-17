// import { GlobalStoreInitializer } from './global-store-initializer'
// import { GlobalStoreProvider } from './global-store-provider'
import { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Inter_Tight } from 'next/font/google'

import '@web-ui/styles/style.scss'

export const revalidate = 0

const inter = Inter({
  subsets: ['latin-ext'],
  variable: '--font-family-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin-ext'],
  variable: '--font-family-inter-tight',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin-ext'],
  variable: '--font-family-plus-jakarta-sans',
  display: 'swap',
})

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${plusJakartaSans.variable}`}
      // color-scheme="dark"
    >
      <body>
        {/* <GlobalStoreProvider> */}
        {/* <GlobalStoreInitializer></GlobalStoreInitializer> */}
        {/* </GlobalStoreProvider> */}
        {children}
      </body>
    </html>
  )
}

export default Layout

export const metadata: Metadata = {
  title: 'TODO',
  description: 'TODO',
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
}
