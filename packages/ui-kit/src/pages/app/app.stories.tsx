import { Ui } from '@/index'
import { uiAboutLayoutPropsData } from '@/components/Organisms/AboutLayout/AboutLayout.data'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'pages/app/guest',
} as Meta

export const standard = () => (
  <Ui.Molecues.LayoutApp
    slotDesktopTopNavigationBar={
      <Ui.Molecues.DesktopTopNavigationBar
        currentTheme={'LIGHT'}
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        onClickSignIn={() => {}}
        navItems={[
          { label: 'Explore', href: '/', isActive: true },
          { label: 'About', href: '/about', isActive: false },
          { label: 'Pricing', href: '/pricing', isActive: false },
        ]}
      />
    }
    slotSidebar={<>slot header</>}
    slotMain={<>slot main</>}
    slotAside={<>slot aside</>}
    slotFooter={<>slot footer</>}
  />
)
