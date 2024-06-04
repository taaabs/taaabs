import { Item } from './item'

export default {
  component: Item,
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
      <Item
        title_="Lorem ipsum"
        bookmark_id_={1}
        created_at_={new Date()}
        url_="http://example.com"
        saves_={100}
        menu_slot_={<>menu</>}
        tags_={[]}
      />
    </div>
  )
}
