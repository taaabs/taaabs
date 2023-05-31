import { Bookmark } from '@/components/Molecules'
import { Ui } from '@/index'
import { LayoutLibrary, LayoutRoot } from '@/components/Layouts'

export default {
  title: 'previews/app/other user catalog',
}

export const Primary = () => (
  <LayoutRoot
    slotHeaderDesktop={
      <Ui.Organisms.HeaderDesktop
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
        otherUserAccount={{ username: 'lorem_ipsum', backHref: '/' }}
      />
    }
    slotHeaderMobile={
      <Ui.Organisms.HeaderMobile
        currentTheme="LIGHT"
        hamburgerIsToggled={false}
        onClickHamburger={() => {}}
        onClickTheme={() => {}}
        otherUserAccount={{ username: 'lorem_ipsum', backHref: '/' }}
        navigation={[]}
      />
    }
    slotFooterDesktop={<div style={{ height: 1000 }}>footer</div>}
    slotBottomNavigationBar={
      <Ui.Molecues.BottomNavigationBar
        onClickAdd={() => {}}
        onClickMyLibrary={() => {}}
        onClickNotifications={() => {}}
        onClickSearch={() => {}}
        onClickUser={() => {}}
      />
    }
  >
    <LayoutLibrary
      slotMain={
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
      }
      slotAside={<>aside</>}
      slotSidebar={<>sidebar</>}
      titleBar={{ primaryText: 'All bookmarks', secondaryText: '3230 results' }}
    />
  </LayoutRoot>
)

const bookmark = (
  <Bookmark
    isStarred={false}
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
    url="https://example.com/test/lorem_ipsum"
    sitePath="test"
    createdAt={new Date('2023-02-20')}
    isNSFW={true}
    isArchived={true}
    tags={['lorem', 'ipsum']}
  />
)
