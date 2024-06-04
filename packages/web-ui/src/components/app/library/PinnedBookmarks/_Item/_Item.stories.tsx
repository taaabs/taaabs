import { _Item } from './_Item'

export default {
  component: _Item,
}

export const Primary = () => {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '50px',
      }}
    >
      <_Item
        title_="Lorem ipsum"
        favicon_host_="http://localhost:4000/v1/favicons"
        on_link_click_={() => {}}
        on_link_middle_click_={() => {}}
        on_new_tab_link_click_={() => {}}
        on_reading_mode_click_={() => {}}
        should_dim_visited_links_={false}
        url_="http://example.com/abc/def"
        site_path_="abc"
        saves_={100}
        menu_slot_={<>menu</>}
      />
    </div>
  )
}
