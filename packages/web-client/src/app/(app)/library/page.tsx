'use client'
// import { useContext } from 'react'
// import { FooterVisibleHeightContext } from '../layout'
import { Library } from '@web-ui/components/app/templates/library'

const Page: React.FC = () => {
  // const footerVisibleHeight = useContext(FooterVisibleHeightContext)
  return (
    <Library
      titleBar={{
        primaryText: 'primary',
        secondaryText: 'secondary',
      }}
      slotAside={<div>slot aside</div>}
      slotSidebar={<div>slot sidebar</div>}
    >
      render bookmarks here
    </Library>
  )
}

export default Page
