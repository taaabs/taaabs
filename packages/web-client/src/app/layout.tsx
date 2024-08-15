import { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Inter_Tight } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import fs from 'fs'
import path from 'path'
import { ModalProvider } from '@/providers/ModalProvider'
import { PopstateCountProvider } from '../providers/PopstateCountProvider'

import 'react-nestable/dist/styles/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'use-context-menu/styles.css'
import 'simplebar-react/dist/simplebar.min.css'
import 'react-sheet-slide/style.css'
import '@web-ui/styles/style.scss'

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

const theme_setter = fs.readFileSync(
  path.resolve(`src/misc/theme-setter.js`),
  'utf8',
)

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <html
      className={`${inter.variable} ${inter_tight.variable} ${plus_jakarta_sans.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        {/* <GlobalStoreInitializer></GlobalStoreInitializer> */}
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
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
        <PopstateCountProvider>
          <ModalProvider>{props.children}</ModalProvider>
        </PopstateCountProvider>
        <script
          /** https://github.com/reactjs/react.dev/blob/main/src/pages/_document.tsx */
          dangerouslySetInnerHTML={{
            __html: `(function () {${theme_setter}})()`,
          }}
        />
      </body>
    </html>
  )
}

export default Layout

export const metadata: Metadata = {
  title: 'Taaabs',
  description: 'The huggiest social bookmarking!',
}

export const viewport: Viewport = {
  userScalable: false, // Required by slidable
}
