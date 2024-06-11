import { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Inter_Tight } from 'next/font/google'
import { ToastContainer } from 'react-toastify'

import 'react-nestable/dist/styles/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'use-context-menu/styles.css'
import 'simplebar-react/dist/simplebar.min.css'
import '@web-ui/styles/style.scss'
import { ReactNode } from 'react'
import { ModalProvider } from '@/providers/modal-provider'
import { AuthProvider } from './auth-provider'
import { LocalDbProvider } from './local-db-provider'

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

const Layout: React.FC<{ children: ReactNode }> = (props) => {
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
        <AuthProvider>
          <LocalDbProvider>
            <ModalProvider>{props.children}</ModalProvider>
          </LocalDbProvider>
        </AuthProvider>
        <script
          /** https://github.com/reactjs/react.dev/blob/main/src/pages/_document.tsx */
          dangerouslySetInnerHTML={{
            __html: `
                (function () {
                  function setTheme(newTheme) {
                    window.__theme = newTheme;
                    if (newTheme == 'dark') {
                      document.documentElement.setAttribute('data-theme', 'dark');
                      document.documentElement.setAttribute('data-theme-set-by', 'user');
                    } else if (newTheme == 'light') {
                      document.documentElement.setAttribute('data-theme', 'light');
                      document.documentElement.setAttribute('data-theme-set-by', 'user');
                    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.setAttribute('data-theme', 'dark');
                      document.documentElement.setAttribute('data-theme-set-by', 'system');
                    } else {
                      document.documentElement.setAttribute('data-theme', 'light');
                      document.documentElement.setAttribute('data-theme-set-by', 'system');
                    }
                    document.documentElement.classList.add('no-transitions')
                    setTimeout(() => {
                      document.documentElement.classList.remove('no-transitions')
                    }, 0);
                  }

                  var preferredTheme = localStorage.getItem('theme');

                  window.__setPreferredTheme = function(newTheme) {
                    preferredTheme = newTheme;
                    setTheme(newTheme);
                    localStorage.setItem('theme', newTheme);
                  };

                  var initialTheme = preferredTheme;
                  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

                  setTheme(initialTheme);

                  darkQuery.addEventListener('change', function (e) {
                    if (!preferredTheme) {
                      setTheme();
                    }
                  });
                })();
              `,
          }}
        />
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
