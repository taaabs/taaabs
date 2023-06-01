import { Page } from '@/types'
import type { AppProps } from 'next/app'

type AppPropsExtended = AppProps & {
  Component: Page
}

const MyApp = ({ Component, pageProps }: AppPropsExtended) => {
  const getLayout =
    Component.getLayout || ((page: React.ReactNode) => <>{page}</>)

  return getLayout(<Component {...pageProps} />)
}

export default MyApp
