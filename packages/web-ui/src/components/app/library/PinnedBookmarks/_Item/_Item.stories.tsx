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
        title="Lorem ipsum"
        favicon_host="http://localhost:4000/v1/favicons"
        on_link_click={() => {}}
        on_link_middle_click={() => {}}
        on_new_tab_click={() => {}}
        on_reading_mode_click={() => {}}
        should_dim_visited_links={false}
        url="http://example.com/abc/def"
        site_path="abc"
        saves={100}
        menu_slot={<>menu</>}
      />
    </div>
  )
}
