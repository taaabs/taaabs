'use client'
import dynamic from 'next/dynamic'

const DynamicLibrary = dynamic(() => import('./DynamicLibrary'), {
  loading: () => <div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>TODO loading skeleton...</div>,
  ssr: false,
})

const Page: React.FC = () => {
  return (
    <DynamicLibrary
      titleBar={{
        primaryText: 'primary',
        secondaryText: 'secondary',
      }}
      slotAside={<div>slot aside</div>}
      slotSidebar={<div>slot sidebar</div>}
    >
      render bookmarks here
    </DynamicLibrary>
  )
}

export default Page
