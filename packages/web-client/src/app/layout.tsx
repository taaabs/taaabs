// import { GlobalStoreInitializer } from './global-store-initializer'
// import { GlobalStoreProvider } from './global-store-provider'
import { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Inter_Tight } from 'next/font/google'

import 'react-toastify/dist/ReactToastify.css'
import '@web-ui/styles/style.scss'
import { ToastContainer } from 'react-toastify'

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
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          closeButton={false}
          icon={false}
        />
        {children}
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
