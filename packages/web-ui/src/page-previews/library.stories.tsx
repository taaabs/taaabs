import { Ui } from '@web-ui'

export default {
  title: 'page-previews/library',
}

export const Primary = () => {
  return (
    <Ui.App.Templates.App
      slot_header_desktop={
        <Ui.App.Templates.AppHeaderDesktop
          slot_left_side_logo={<Ui.Common.Atoms.LogoForHeader href="" />}
          slot_left_side_navigation={
            <Ui.App.Molecules.NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', is_active: false },
                { label: 'Ipsum', href: '/ipsum', is_active: true },
              ]}
            />
          }
          slot_right_side={
            <Ui.App.Organisms.DesktopUserAreaForAppHeader
              on_click_add={() => {}}
              on_click_search={() => {}}
            />
          }
        />
      }
      slot_header_mobile={
        <Ui.App.Templates.AppHeaderMobile
          slot_logo={<Ui.Common.Atoms.LogoForHeader href="" />}
          slot_navigation={
            <Ui.App.Molecules.NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', is_active: false },
                { label: 'Ipsum', href: '/ipsum', is_active: true },
              ]}
            />
          }
        />
      }
      slot_bottom_navigation_bar={
        <Ui.App.Molecules.BottomNavigationBar
          home_on_click={() => {}}
          my_library_on_click={() => {}}
          add_on_click={() => {}}
          notifications_on_click={() => {}}
          search_on_click={() => {}}
          user_on_click={() => {}}
        />
      }
    >
      <Ui.App.Templates.Library
        slot_aside={<>aside</>}
        slot_sidebar={
          <Ui.App.Atoms.NavigationForLibrarySidebar
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
    </Ui.App.Templates.App>
  )
}

const bookmark = (
  <div style={{ marginBottom: 'var(--distance-8px)' }}>
    <Ui.App.Atoms.Bookmark
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
      updated_at=""
      is_fetching_bookmarks={false}
    />
  </div>
)
