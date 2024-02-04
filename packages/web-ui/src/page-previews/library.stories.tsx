import { Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import { NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { App } from '@web-ui/components/app/templates/app'
import { AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'
import { Library } from '@web-ui/components/app/templates/library'
import { LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'

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
          items={[
            {
              icon_variant: 'HOME',
              icon_variant_active: 'HOME_FILLED',
              is_active: true,
              label: 'Home',
              on_click: () => {},
            },
          ]}
        />
      }
    >
      <Library
        slot_aside={<>aside</>}
        slot_tag_hierarchies={
          <>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a dui
            felis. Donec ultrices placerat est. Cras eget pellentesque neque,
            quis aliquam sem. Nulla interdum eu nibh at efficitur. Nunc ut nulla
            non neque rutrum luctus. Cras iaculis lectus id mi vestibulum
            sollicitudin. Fusce nec egestas nibh. Nulla ullamcorper ipsum nisi,
            eget volutpat justo varius non. Pellentesque venenatis, lacus non
            rutrum blandit, quam mi gravida libero, a finibus leo mauris et
            elit. Morbi elit lectus, pellentesque ac ipsum vel, ullamcorper
            rutrum quam. In justo sapien, sagittis vel sapien vel, pretium
            posuere augue. Suspendisse ligula lorem, laoreet ut sagittis in,
            maximus tincidunt dui. Cras eleifend quam ex, ut bibendum nulla
            interdum a. Cras imperdiet consequat lorem vel fermentum. Mauris
            consequat porttitor magna vitae semper. Nam pretium fermentum tellus
            nec vestibulum. Maecenas interdum ligula vitae dui dictum,
            scelerisque malesuada nisi tempus. Vestibulum congue lacus euismod
            blandit accumsan. Integer rutrum sapien a massa commodo laoreet. Nam
            elementum mollis tortor sed feugiat. Cras ultrices risus faucibus
            ipsum pellentesque volutpat sit amet sed tortor. Fusce eu erat elit.
            Etiam pretium velit non malesuada tristique. Etiam et nisl id ligula
            tincidunt fringilla. Nulla quis finibus enim. Cras sollicitudin nibh
            velit.
          </>
        }
        slot_toolbar={<>toolbar</>}
        mobile_title_bar="Bookmarks"
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
        translations={{
          collapse_alt: '',
          subscribe: '',
          unsubscribe: '',
        }}
      />
    </App>
  )
}

const bookmark = (
  <Bookmark
    date={new Date()}
    links={[]}
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    is_unread={true}
    tags={[
      { id: 1, name: 'foo', yields: 100 },
      { id: 2, name: 'bar', isSelected: true },
    ]}
    on_tag_click={() => {}}
    on_click={() => {}}
    on_menu_click={async () => {}}
    on_selected_tag_click={() => {}}
    set_render_height={() => {}}
    favicon_host=""
    menu_slot={<></>}
    number_of_selected_tags={0}
    should_dim_visited_links={false}
    stars={0}
    updated_at=""
    is_fetching_bookmarks={false}
    bookmark_id={1}
    density="default"
    on_mouse_up_on_tag={() => {}}
    on_tag_delete_click={() => {}}
  />
)
