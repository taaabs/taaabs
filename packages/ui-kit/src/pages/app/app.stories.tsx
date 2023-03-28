import { Ui } from '@/index'
import { Meta } from '@storybook/react'
import { LayoutApp, LayoutRoot } from '@/layouts'

export default {
  title: 'pages/app/guest',
} as Meta

export const standard = () => (
  <LayoutRoot
    slotDesktopHeader={
      <Ui.Molecues.DesktopTopNavigationBar
        currentTheme={'LIGHT'}
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        onClickSignIn={() => {}}
        onClickAdd={() => {}}
        navItems={[
          { label: 'Explore', href: '/', isActive: true },
          { label: 'About', href: '/about', isActive: false },
          { label: 'Pricing', href: '/pricing', isActive: false },
        ]}
      />
    }
    slotMobileHeader={<>mobile header</>}
  >
    <LayoutApp
      slotMain={<>main</>}
      slotAside={<>aside</>}
      slotFooter={<>footer</>}
      slotSidebar={<>sidebar</>}
    ></LayoutApp>
  </LayoutRoot>
)
