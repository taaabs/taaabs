import { App } from '@web-ui/components/app/templates/App'
import { Bookmark } from '@web-ui/components/app/molecules/Bookmark'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/BottomNavigationBar'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/AppHeaderDesktop'
import { Library } from '@web-ui/components/app/templates/Library'
import { LogoForHeader } from '@web-ui/components/common/molecules/LogoForHeader'
import { NavigationForHeader } from '@web-ui/components/app/molecules/NavigationForHeader'
import { AppHeaderMobile } from '@web-ui/components/app/templates/AppHeaderMobile'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/DesktopUserAreaForAppHeader'
import { useElementVisibleHeight } from '@web-ui/hooks/useElementVisibleHeight'
import { useRef } from 'react'
import { NavigationForSidebar } from '@web-ui/components/app/atoms/NavigationForSidebar'

export default {
  title: 'page-previews/library',
}

export const Primary = () => {
  const footer = useRef<HTMLDivElement>(null)
  const footerVisibleHeight = useElementVisibleHeight(footer)

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
      slotFooterDesktop={
        <div style={{ height: 1000 }} ref={footer}>
          footer
        </div>
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
          <NavigationForSidebar
            navigationItems={[
              { label: 'All bookmarks', isActive: true, onClick: () => {} },
              { label: 'Categories', isActive: false, onClick: () => {} },
            ]}
          />
        }
        titleBar={{
          primaryText: 'All bookmarks',
          secondaryText: '3230 results',
        }}
        bottomOffset={footerVisibleHeight}
      >
        {bookmark}
        {bookmark}
        {bookmark}
        {bookmark}
        {bookmark}
      </Library>
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
      isNSFW={true}
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
