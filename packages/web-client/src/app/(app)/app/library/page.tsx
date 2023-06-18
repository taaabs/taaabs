'use client'
import { Library } from '@web-ui/components/app/templates/Library'
import { useContext } from 'react'
import { FooterVisibleHeightContext } from '../../layout'

const Page: React.FC = () => {
  const footerVisibleHeight = useContext(FooterVisibleHeightContext)
  return (
    <Library
      titleBar={{
        primaryText: 'primary',
        secondaryText: 'secondary',
      }}
      slotAside={<div>slot aside</div>}
      slotSidebar={<div>slot sidebar</div>}
      bottomOffset={footerVisibleHeight}
    >
      render bookmarks here
    </Library>
  )
}

export default Page
