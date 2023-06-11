import { App } from '@web-ui/components/Templates/App'
import { Bookmark } from '@web-ui/components/Molecules/Bookmark'
import { BottomNavigationBar } from '@web-ui/components/Molecules/BottomNavigationBar'
import { HeaderDesktop } from '@web-ui/components/Templates/HeaderDesktop'
import { Library } from '@web-ui/components/Templates/Library'
import { LogoForHeader } from '@web-ui/components/Molecules/LogoForHeader'
import { NavigationForHeader } from '@web-ui/components/Molecules/NavigationForHeader/NavigationForHeader'
import { HeaderMobile } from '@web-ui/components/Templates/HeaderMobile'
import { HeaderDesktopUserArea } from '@web-ui/components/Organisms/HeaderDesktopUserArea/HeaderDesktopUserArea'

export default {
  title: 'page-previews/library',
}

export const Primary = () => (
  <App
    slotHeaderDesktop={
      <HeaderDesktop
        logoSlot={<LogoForHeader />}
        navigationSlot={
          <NavigationForHeader
            navigation={[
              { label: 'Lorem', href: '/lorem', isActive: false },
              { label: 'Ipsum', href: '/ipsum', isActive: true },
            ]}
          />
        }
        rightSideSlot={
          <HeaderDesktopUserArea
            onClickAdd={() => {}}
            onClickSearch={() => {}}
            currentTheme="LIGHT"
            onClickTheme={() => {}}
            onClickNotifications={() => {}}
          />
        }
      />
    }
    slotHeaderMobile={
      <HeaderMobile
        logoSlot={<LogoForHeader />}
        navigationSlot={
          <NavigationForHeader
            navigation={[
              { label: 'Lorem', href: '/lorem', isActive: false },
              { label: 'Ipsum', href: '/ipsum', isActive: true },
            ]}
          />
        }
      />
    }
    slotFooterDesktop={<div style={{ height: 1000 }}>footer</div>}
    slotBottomNavigationBar={
      <BottomNavigationBar
        onClickAdd={() => {}}
        onClickMyLibrary={() => {}}
        onClickNotifications={() => {}}
        onClickSearch={() => {}}
        onClickUser={() => {}}
      />
    }
  >
    <Library
      slotAside={<>aside</>}
      slotSidebar={<>sidebar</>}
      titleBar={{ primaryText: 'All bookmarks', secondaryText: '3230 results' }}
    >
      <>
        <br />
        {bookmark}
        <br />
        {bookmark}
        <br />
        {bookmark}
        <br />
        {bookmark}
        <br />
        {bookmark}
      </>
    </Library>
  </App>
)

const bookmark = (
  <Bookmark
    isStarred={false}
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
    url="https://example.com/test/lorem_ipsum"
    site="test"
    createdAt={new Date('2023-02-20')}
    isNSFW={true}
    isArchived={true}
    tags={['lorem', 'ipsum']}
  />
)
