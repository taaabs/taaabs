import { Ui } from '@/index'
import { Meta } from '@storybook/react'
import { LayoutApp, LayoutRoot } from '@/layouts'

export default {
  title: 'pages/app/guest',
} as Meta

export const standard = () => (
  <LayoutRoot
    slotHeaderDesktop={
      <Ui.Molecues.HeaderDesktop
        currentTheme="LIGHT"
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
    slotHeaderMobile={
      <Ui.Molecues.HeaderMobile
        currentTheme="LIGHT"
        hamburgerIsToggled={false}
        onClickHamburger={() => {}}
        onClickTheme={() => {}}
      />
    }
  >
    <LayoutApp
      slotMain={<>main</>}
      slotAside={<>aside</>}
      slotFooter={<>footer</>}
      slotSidebar={<>sidebar</>}
    ></LayoutApp>
  </LayoutRoot>
)
