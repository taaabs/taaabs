import { Bookmark } from './bookmark'
import { StorybookSpacer } from '@web-ui/helpers/storybook'

export default {
  component: Bookmark,
}

export const Primary = () => (
  <div
    style={{
      background: 'var(--Library-background)',
    }}
  >
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '50px',
      }}
    >
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={0}
        title="Lorem ipsum dolor sit amet"
        note="Lorem ipsum dolor sit amet"
        is_unread={false}
        tags={[]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          {
            url: 'https://foooooooooooooooooooooooooooooooooooooooooooooooooooo.com/baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaar',
            saves: 99,
            menu_slot: <>menu</>,
          },
          {
            url: 'https://google.com/bar/baz',
            site_path: 'bar',
            saves: 99,
            menu_slot: <>menu</>,
          },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={0}
        title="Lorem ipsum"
        note="Lorem ipsum dolor sit amet"
        is_unread={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        highlights={[
          [1, 2],
          [12, 2],
          [18, 2],
          [32, 2],
        ]}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={0}
        title="Lorem ipsum dolor sit amet"
        is_unread={false}
        tags={[]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <Bookmark
        bookmark_id={1}
        is_public={false}
        density="default"
        stars={0}
        title="Lorem ipsum dolor sit amet"
        is_unread={false}
        tags={[]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={0}
        title="Lorem ipsum dolor sit amet"
        note="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies sapien nulla, at facilisis risus dictum sed."
        is_unread={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', is_selected: true },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      Compact:
      <br />
      <br />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        is_compact={true}
        stars={0}
        title="Lorem ipsum dolor sit amet"
        note="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies sapien nulla, at facilisis risus dictum sed."
        is_unread={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', is_selected: true },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={2}
        title="Lorem ipsum dolor sit amet"
        is_unread={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={0}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_unread={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'lorem1', yields: 8 },
          { id: 1, name: 'lorem2', yields: 8 },
          { id: 1, name: 'lorem3', yields: 8 },
          { id: 1, name: 'lorem4', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
          { id: 1, name: 'lorem3', yields: 8 },
          { id: 1, name: 'lorem4', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={0}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_unread={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={2}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_unread={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={2}
        title="Lorem ipsum dolor sit amet"
        is_unread={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id={1}
        is_public={true}
        points={100}
        density="default"
        stars={2}
        is_unread={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={async () => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://google.com', saves: 99, menu_slot: <>menu</> },
          {
            url: 'https://github.com/lorem/ipsum',
            saves: 99,
            menu_slot: <>menu</>,
          },
        ]}
        set_render_height={() => {}}
        favicon_host="http://localhost:4000/v1/favicons"
        menu_slot={<>menu</>}
        should_dim_visited_links={false}
        updated_at=""
        on_tag_drag_start={() => {}}
        on_tag_delete_click={() => {}}
        on_give_point_click={() => {}}
        pinned_links_count={0}
        index={0}
        library_url=""
      />
      <StorybookSpacer />
    </div>
  </div>
)
