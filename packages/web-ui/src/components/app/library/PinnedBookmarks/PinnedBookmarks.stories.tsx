import { PinnedBookmarks } from './PinnedBookmarks'

export default {
  component: PinnedBookmarks,
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
      <PinnedBookmarks
        items_={[
          {
            bookmark_id_: 1,
            title_: 'Lorem ipsum',
            created_at_: new Date(),
            url_: 'http://example.com',
            saves_: 100,
            tags_: [],
          },
          {
            bookmark_id_: 2,
            title_: 'Lorem ipsum',
            created_at_: new Date(),
            url_: 'http://example.com',
            saves_: 100,
            tags_: [],
          },
        ]}
        is_draggable_={true}
        on_middle_click_={() => {}}
        selected_archived_={false}
        selected_starred_={false}
        selected_tags_={[]}
        selected_unsorted_={false}
        on_change_={() => {}}
        on_click_={() => {}}
        favicon_host_="http://localhost:4000/v1/favicons"
        translations_={{
          nothing_pinned_: 'lorem ipsum',
        }}
      />
    </div>
  )
}
