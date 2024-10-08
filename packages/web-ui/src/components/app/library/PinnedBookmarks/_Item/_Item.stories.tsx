import { _Item } from './_Item'

export default {
  component: _Item,
}

export const Default = () => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '50px',
      }}
    >
      <_Item
        url="http://example.com/abc/def"
        menu_slot={<>menu</>}
        favicon_host="http://localhost:4000/v1/favicons"
        on_reading_mode_click={() => {}}
        should_dim_visited_links={false}
        on_link_click={() => {}}
        on_link_middle_click={() => {}}
        on_new_tab_click={() => {}}
        on_is_visible={() => {}}
        created_at={new Date()}
        is_public={false}
        title="Lorem ipsum"
        site_path="abc"
        saves={100}
        open_snapshot={false}
        favicon={undefined}
        is_parsed={true}
        stars={0}
        on_menu_toggled={() => {}}
        on_video_player_click={() => {}}
      />
    </div>
  )
}
