import { Bookmark as UiAppAtom_Bookmark } from '@web-ui/components/app/atoms/bookmark'
import { BottomNavigationBar as UiAppMolecule_BottomNavigationBar } from '@web-ui/components/app/molecules/bottom-navigation-bar'
import { NavigationForHeader as UiAppMolecule_NavigationForHeader } from '@web-ui/components/app/molecules/navigation-for-header'
import { DesktopUserAreaForAppHeader as UiAppOrganism_DesktopUserAreaForAppHeader } from '@web-ui/components/app/organisms/desktop-user-area-for-app-header'
import { App as UiAppTemplate_App } from '@web-ui/components/app/templates/app'
import { AppHeaderDesktop as UiAppTemplate_AppHeaderDesktop } from '@web-ui/components/app/templates/app-header-desktop'
import { AppHeaderMobile as UiAppTemplate_AppHeaderMobile } from '@web-ui/components/app/templates/app-header-mobile'
import { SwipableColumns as UiAppTemplate_Library } from '@web-ui/components/app/templates/swipable-columns'
import { LogoForHeader as UiCommonAtom_LogoForHeader } from '@web-ui/components/common/atoms/logo-for-header'

export default {
  title: 'page-previews/library',
}

export const Primary = () => {
  return (
    <UiAppTemplate_App
      slot_header_desktop={
        <UiAppTemplate_AppHeaderDesktop
          slot_logo={<UiCommonAtom_LogoForHeader href="" />}
          slot_navigation={
            <UiAppMolecule_NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', is_active: false },
                { label: 'Ipsum', href: '/ipsum', is_active: true },
              ]}
            />
          }
          slot_right_side={
            <UiAppOrganism_DesktopUserAreaForAppHeader
              on_click_add={() => {}}
              on_click_search={() => {}}
            />
          }
          translations={{ powered_by: 'Powered by' }}
          cockroach_url="https://example.com"
        />
      }
      slot_header_mobile={
        <UiAppTemplate_AppHeaderMobile
          slot_logo={<UiCommonAtom_LogoForHeader href="" />}
          slot_navigation={
            <UiAppMolecule_NavigationForHeader
              navigation={[
                { label: 'Lorem', href: '/lorem', is_active: false },
                { label: 'Ipsum', href: '/ipsum', is_active: true },
              ]}
            />
          }
        />
      }
      slot_bottom_navigation_bar={
        <UiAppMolecule_BottomNavigationBar
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
      <UiAppTemplate_Library
        slot_aside_={<>aside</>}
        slot_tag_hierarchies_={
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
        slot_toolbar_={<>toolbar</>}
        mobile_title_bar="Bookmarks"
        on_page_bottom_reached_={() => {}}
        slot_pinned_={<>pinned</>}
        are_bookmarks_dimmed_={false}
        is_not_interactive={false}
        slot_bookmarks_={
          <>
            {bookmark}
            {bookmark}
            {bookmark}
            {bookmark}
            {bookmark}
          </>
        }
        show_skeletons_={false}
        slot_search_={<>search</>}
        translations_={{
          collapse_alt_: '',
          follow_: '',
          unfollow_: '',
        }}
        close_aside_count={0}
        info_text_=""
      />
    </UiAppTemplate_App>
  )
}

const bookmark = (
  <UiAppAtom_Bookmark
    date_={new Date()}
    links_={[]}
    title_="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    is_unread_={true}
    tags_={[
      { id: 1, name_: 'foo', yields_: 100 },
      { id: 2, name_: 'bar', is_selected_: true },
    ]}
    on_tag_click_={() => {}}
    on_click_={() => {}}
    on_selected_tag_click_={() => {}}
    favicon_host_=""
    menu_slot_={<></>}
    should_dim_visited_links_={false}
    stars_={0}
    updated_at_=""
    bookmark_id_={1}
    density_="default"
    on_tag_delete_click_={() => {}}
    index_={0}
    is_public_={true}
    on_give_point_click_={() => {}}
    created_at_={new Date()}
    library_url_=""
    on_get_points_given_click_={() => {}}
    on_link_click_={() => {}}
    on_link_middle_click_={() => {}}
    on_new_tab_link_click_={() => {}}
  />
)
