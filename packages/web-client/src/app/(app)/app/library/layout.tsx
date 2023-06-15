import dynamic from 'next/dynamic'
const Library = dynamic(() => import('./DynamicLibraryTemplate'), {
  loading: () => <div>loading...</div>,
  ssr: false,
})

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Library
      titleBar={{
        primaryText: 'primary',
        secondaryText: 'secondary'
      }}
      slotAside={<div>slot aside</div>}
      slotSidebar={<div>slot sidebar</div>}
    >
      {children}
    </Library>
  )
}

export default Layout
