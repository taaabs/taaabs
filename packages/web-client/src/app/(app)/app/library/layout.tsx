import dynamic from 'next/dynamic'
const DynamicLibrary = dynamic(() => import('./DynamicLibrary'), {
  loading: () => <div>TODO loading skeleton...</div>,
  ssr: false,
})

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <DynamicLibrary
      titleBar={{
        primaryText: 'primary',
        secondaryText: 'secondary'
      }}
      slotAside={<div>slot aside</div>}
      slotSidebar={<div>slot sidebar</div>}
    >
      {children}
    </DynamicLibrary>
  )
}

export default Layout
