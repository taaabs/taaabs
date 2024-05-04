import { ReactNode } from 'react'
import { Metadata } from 'next'

const Layout: React.FC<{ children?: ReactNode }> = (props) => {
  return props.children
}

export default Layout

export const metadata: Metadata = {
  title: 'Account',
}
