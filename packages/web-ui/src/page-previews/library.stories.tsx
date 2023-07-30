import { App } from '@web-ui/components/app/templates/app'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { Library } from '@web-ui/components/app/templates/library'
import { LogoForHeader } from '@web-ui/components/common/molecules/logo-for-header'
import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { NavigationForLibrarySidebar } from '@web-ui/components/app/atoms/navigation-for-library-sidebar'

export default {
  title: 'page-previews/library',
}

export const Primary = () => {
  return (
    <App
      slotAppHeaderDesktop={
        <AppHeaderDesktop
          logoSlot={<LogoForHeader href="" />}
          navigationSlot={
            <NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', isActive: false },
                { label: 'Ipsum', href: '/ipsum', isActive: true },
              ]}
            />
          }
          rightSideSlot={
            <DesktopUserAreaForAppHeader
              onClickAdd={() => {}}
              onClickSearch={() => {}}
              onClickNotifications={() => {}}
            />
          }
        />
      }
      slotAppHeaderMobile={
        <AppHeaderMobile
          logoSlot={<LogoForHeader href="" />}
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
        slotSidebar={
          <NavigationForLibrarySidebar
            navigationItems={[
              { label: 'All bookmarks', isActive: true, onClick: () => {} },
              { label: 'Categories', isActive: false, onClick: () => {} },
            ]}
          />
        }
        titleBar="All bookmarks"
        getMoreBookmarks={() => {}}
        hasMoreBookmarks={false}
        isGettingFirstBookmarks={false}
        isGettingMoreBookmarks={false}
        slotBookmarks={
          <>
            {bookmark}
            {bookmark}
            {bookmark}
            {bookmark}
            {bookmark}
          </>
        }
        noResults={false}
        showBookmarksSkeleton={false}
      ></Library>
    </App>
  )
}

const bookmark = (
  <div style={{ marginBottom: 'var(--distance-8px)' }}>
    <Bookmark
      isStarred={false}
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
      url="https://example.com/test/lorem_ipsum"
      site="example.com/test"
      createdAt={new Date('2023-02-20')}
      isNsfw={true}
      isArchived={true}
      tags={['lorem', 'ipsum']}
      visibility="private"
      saves={3400}
      onSiteClick={() => {}}
      onDateClick={() => {}}
      onSavesClick={() => {}}
      onVisibilityClick={() => {}}
    />
  </div>
)
