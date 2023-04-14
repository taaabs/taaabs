import { Ui } from '@/index'
import { Meta } from '@storybook/react'
import { Layout2ndApp, Layout1st } from '@/layouts'

export default {
  title: 'previews/app/otherUserFolder',
} as Meta

export const standard = () => (
  <Layout1st
    slotHeaderDesktop={
      <Ui.Molecues.HeaderDesktop
        currentTheme="LIGHT"
        onClickSearch={() => {}}
        onClickTheme={() => {}}
        onClickSignIn={() => {}}
        onClickAdd={() => {}}
        navigation={[
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
    slotBottomNavigationBar={<Ui.Molecues.BottomNavigationBar />}
  >
    <Layout2ndApp
      slotMain={<>main</>}
      slotAside={<>aside</>}
      slotSidebar={<>sidebar</>}
    ></Layout2ndApp>
  </Layout1st>
)
