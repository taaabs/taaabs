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
        items={[
          {
            bookmark_id: 1,
            title: 'Lorem ipsum',
            created_at: new Date(),
            url: 'http://example.com',
            saves: 100,
            tags: [],
          },
          {
            bookmark_id: 2,
            title: 'Lorem ipsum',
            created_at: new Date(),
            url: 'http://example.com',
            saves: 100,
            tags: [],
          },
        ]}
        is_draggable={true}
        on_middle_click={() => {}}
        selected_archived={false}
        selected_starred={false}
        selected_tags={[]}
        selected_unsorted={false}
        on_change={() => {}}
        on_click={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        translations={{
          nothing_pinned: 'lorem ipsum',
        }}
      />
    </div>
  )
}
