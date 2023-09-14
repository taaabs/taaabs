import { App } from '@web-ui/components/app/templates/app'
import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { Library } from '@web-ui/components/app/templates/library'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'
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
            navigation_items={[
              { label: 'All bookmarks', is_active: true, on_click: () => {} },
              { label: 'Categories', is_active: false, on_click: () => {} },
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
      is_starred={false}
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
      url="https://example.com/test/lorem_ipsum"
      is_nsfw={true}
      tags={[
        { name: 'foo', yields: 100 },
        { name: 'bar', isSelected: true },
      ]}
      saves={3400}
      on_tag_click={() => {}}
      on_click={() => {}}
      on_menu_click={() => {}}
      on_selected_tag_click={() => {}}
    />
  </div>
)
