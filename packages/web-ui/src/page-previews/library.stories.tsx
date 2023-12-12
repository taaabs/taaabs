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
      slot_header_desktop={
        <AppHeaderDesktop
          slot_left_side_logo={<LogoForHeader href="" />}
          slot_left_side_navigation={
            <NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', is_active: false },
                { label: 'Ipsum', href: '/ipsum', is_active: true },
              ]}
            />
          }
          slot_right_side={
            <DesktopUserAreaForAppHeader
              on_click_add={() => {}}
              on_click_search={() => {}}
            />
          }
        />
      }
      slot_header_mobile={
        <AppHeaderMobile
          slot_logo={<LogoForHeader href="" />}
          slot_navigation={
            <NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', is_active: false },
                { label: 'Ipsum', href: '/ipsum', is_active: true },
              ]}
            />
          }
        />
      }
      slot_bottom_navigation_bar={
        <BottomNavigationBar
          home_on_click={() => {}}
          my_library_on_click={() => {}}
          add_on_click={() => {}}
          notifications_on_click={() => {}}
          search_on_click={() => {}}
          user_on_click={() => {}}
        />
      }
    >
      <Library
        slot_aside={<>aside</>}
        slot_sidebar={
          <NavigationForLibrarySidebar
            navigation_items={[
              { label: 'All bookmarks', is_active: true, on_click: () => {} },
              { label: 'Categories', is_active: false, on_click: () => {} },
            ]}
          />
        }
        mobile_title_bar="All bookmarks"
        get_more_bookmarks={() => {}}
        has_more_bookmarks={false}
        is_fetching_first_bookmarks={false}
        is_fetching_more_bookmarks={false}
        slot_bookmarks={
          <>
            {bookmark}
            {bookmark}
            {bookmark}
            {bookmark}
            {bookmark}
          </>
        }
        show_bookmarks_skeleton={false}
        slot_search={<>search</>}
      />
    </App>
  )
}

const bookmark = (
  <div style={{ marginBottom: 'var(--distance-8px)' }}>
    <Bookmark
      date={new Date()}
      links={[]}
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
      is_unread={true}
      tags={[
        { id: 1, name: 'foo', yields: 100 },
        { id: 2, name: 'bar', isSelected: true },
      ]}
      on_tag_click={() => {}}
      on_click={() => {}}
      on_menu_click={() => {}}
      on_selected_tag_click={() => {}}
      set_render_height={() => {}}
      favicon_host=""
      is_serach_result={false}
      menu_slot={<></>}
      number_of_selected_tags={0}
      should_dim_visited_links={false}
      stars={0}
    />
  </div>
)
