import { Bookmark as Ui_app_library_Bookmark } from '@web-ui/components/app/library/Bookmark'
import { BottomNavigationBar as Ui_app_templates_App_BottomNavigationBar } from '@web-ui/components/app/templates/App/BottomNavigationBar'
import { App as Ui_app_templates_App } from '@web-ui/components/app/templates/App'
import { HeaderDesktop as Ui_app_templates_App_HeaderDesktop } from '@web-ui/components/app/templates/App/HeaderDesktop'
import { HeaderMobile as Ui_app_templates_App_HeaderMobile } from '@web-ui/components/app/templates/App/HeaderMobile'
import { SwipableColumns as Ui_app_templates_App_content_SwipableColumns } from '@web-ui/components/app/templates/App/content/SwipableColumns'
import { LogoForHeader as UiLogoForHeader } from '@web-ui/components/LogoForHeader'

export default {
  title: 'page-previews/library',
}

export const Primary = () => {
  return (
    <Ui_app_templates_App
      slot_header_desktop={
        <Ui_app_templates_App_HeaderDesktop
          slot_left={<UiLogoForHeader href="" />}
          slot_middle={<></>}
          slot_right={<></>}
        />
      }
      slot_header_mobile={
        <Ui_app_templates_App_HeaderMobile
          slot_logo={<UiLogoForHeader href="" />}
          slot_navigation={<></>}
        />
      }
      slot_bottom_navigation_bar={
        <Ui_app_templates_App_BottomNavigationBar
          items={[
            {
              icon_variant: 'HOME',
              icon_variant_active: 'HOME_FILLED',
              is_active: true,
              title: 'xxx',
              on_click: () => {},
            },
          ]}
        />
      }
      slot_content={
        <Ui_app_templates_App_content_SwipableColumns
          slot_column_right={<>aside</>}
          slot_column_left={
            <>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a
              dui felis. Donec ultrices placerat est. Cras eget pellentesque
              neque, quis aliquam sem. Nulla interdum eu nibh at efficitur. Nunc
              ut nulla non neque rutrum luctus. Cras iaculis lectus id mi
              vestibulum sollicitudin. Fusce nec egestas nibh. Nulla ullamcorper
              ipsum nisi, eget volutpat justo varius non. Pellentesque
              venenatis, lacus non rutrum blandit, quam mi gravida libero, a
              finibus leo mauris et elit. Morbi elit lectus, pellentesque ac
              ipsum vel, ullamcorper rutrum quam. In justo sapien, sagittis vel
              sapien vel, pretium posuere augue. Suspendisse ligula lorem,
              laoreet ut sagittis in, maximus tincidunt dui. Cras eleifend quam
              ex, ut bibendum nulla interdum a. Cras imperdiet consequat lorem
              vel fermentum. Mauris consequat porttitor magna vitae semper. Nam
              pretium fermentum tellus nec vestibulum. Maecenas interdum ligula
              vitae dui dictum, scelerisque malesuada nisi tempus. Vestibulum
              congue lacus euismod blandit accumsan. Integer rutrum sapien a
              massa commodo laoreet. Nam elementum mollis tortor sed feugiat.
              Cras ultrices risus faucibus ipsum pellentesque volutpat sit amet
              sed tortor. Fusce eu erat elit. Etiam pretium velit non malesuada
              tristique. Etiam et nisl id ligula tincidunt fringilla. Nulla quis
              finibus enim. Cras sollicitudin nibh velit.
            </>
          }
          slot_toolbar={<>toolbar</>}
          on_page_bottom_reached={() => {}}
          are_bookmarks_dimmed={false}
          slot_main={
            <>
              {bookmark}
              {bookmark}
              {bookmark}
              {bookmark}
              {bookmark}
            </>
          }
          slot_search={<>search</>}
          translations={{
            collapse_alt: '',
            follow: '',
            unfollow: '',
            folders: '',
            mobile_title_bar: '',
            clear_selected_tags: '',
          }}
          info_text=""
        />
      }
    />
  )
}

const bookmark = (
  <Ui_app_library_Bookmark
    date={new Date()}
    links={[]}
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
    is_unsorted={true}
    tags={[
      { id: 1, name: 'foo', yields: 100 },
      { id: 2, name: 'bar', is_selected: true },
    ]}
    on_tag_click={() => {}}
    on_click={() => {}}
    on_selected_tag_click={() => {}}
    favicon_host=""
    menu_slot={<></>}
    should_dim_visited_links={false}
    stars={0}
    updated_at=""
    bookmark_id={1}
    density="default"
    on_tag_delete_click={() => {}}
    is_public={true}
    on_give_point_click={() => {}}
    created_at={new Date()}
    library_url=""
    on_get_points_given_click={() => {}}
    on_link_click={() => {}}
    on_link_middle_click={() => {}}
    on_new_tab_click={() => {}}
    locale="en"
    on_reading_mode_click={() => {}}
    translations={{ delete: 'delete', rename: 'rename' }}
    set_render_height={() => {}}
    on_saves_click={() => {}}
    on_video_player_click={() => {}}
  />
)
