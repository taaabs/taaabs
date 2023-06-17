'use client'
import { Library } from '@web-ui/components/app/templates/Library'

const Page: React.FC = () => {
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
