'use client'
import dynamic from 'next/dynamic'

const Library = dynamic(() => import('./dynamic-library'), {
  loading: () => <p>loading...</p>,
  ssr: false,
})

export default function Page() {
  return (
    <Library
      slotSidebar={<>sidebar</>}
      slotAside={<>aside</>}
      titleBar={{ primaryText: 'primary', secondaryText: 'secondary' }}
    >
      x
    </Library>
  )
}
