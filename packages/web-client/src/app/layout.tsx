// import { GlobalStoreInitializer } from './global-store-initializer'
// import { GlobalStoreProvider } from './global-store-provider'
import { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Inter_Tight } from 'next/font/google'
import { ToastContainer } from 'react-toastify'

import 'react-nestable/dist/styles/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'use-context-menu/styles.css'
import '@web-ui/styles/style.scss'
import { GlobalLibrarySearchProvider } from './global-library-search-provider'
import { ReactNode } from 'react'
import { ModalProvider } from '@/providers/modal-provider'

export const revalidate = 0

const inter = Inter({
  subsets: ['latin-ext'],
  variable: '--font-family-inter',
  display: 'swap',
})

const inter_tight = Inter_Tight({
  subsets: ['latin-ext'],
  variable: '--font-family-inter-tight',
  display: 'swap',
})

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ['latin-ext'],
  variable: '--font-family-plus-jakarta-sans',
  display: 'swap',
})

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter_tight.variable} ${plus_jakarta_sans.variable}`}
      // color-scheme="dark"
    >
      <body>
        {/* <GlobalStoreProvider> */}
        {/* <GlobalStoreInitializer></GlobalStoreInitializer> */}
        {/* </GlobalStoreProvider> */}
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="light"
          closeButton={false}
          icon={false}
          draggablePercent={20}
        />
        <GlobalLibrarySearchProvider>
          <ModalProvider>{children}</ModalProvider>
        </GlobalLibrarySearchProvider>
      </body>
    </html>
  )
}

export default Layout

export const metadata: Metadata = {
  title: 'TODO',
  description: 'TODO',
}

export const viewport: Viewport = {
  userScalable: false, // Required by slidable
}
