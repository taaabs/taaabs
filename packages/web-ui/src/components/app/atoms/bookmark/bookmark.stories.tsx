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
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={0}
        title_="Lorem ipsum dolor sit amet"
        note_="Lorem ipsum dolor sit amet"
        is_unread_={false}
        tags_={[]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          {
            url_: 'https://foooooooooooooooooooooooooooooooooooooooooooooooooooo.com/baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaar',
            saves_: 99,
            menu_slot_: <>menu</>,
            is_pinned_: true,
          },
          {
            url_: 'https://google.com/bar/baz',
            site_path_: 'bar',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={0}
        title_="Lorem ipsum"
        note_="Lorem ipsum dolor sit amet"
        is_unread_={false}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        is_search_result_={true}
        highlights_={[
          [1, 2],
          [12, 2],
          [18, 2],
          [32, 2],
        ]}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={0}
        title_="Lorem ipsum dolor sit amet"
        is_unread_={false}
        tags_={[]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <Bookmark
        bookmark_id_={1}
        is_public_={false}
        density_="default"
        stars_={0}
        title_="Lorem ipsum dolor sit amet"
        is_unread_={false}
        tags_={[]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={0}
        title_="Lorem ipsum dolor sit amet"
        note_="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies sapien nulla, at facilisis risus dictum sed."
        is_unread_={false}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', is_selected_: true },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      Compact:
      <br />
      <br />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        is_compact_={true}
        stars_={0}
        title_="Lorem ipsum dolor sit amet"
        note_="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies sapien nulla, at facilisis risus dictum sed."
        is_unread_={false}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', is_selected_: true },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={2}
        title_="Lorem ipsum dolor sit amet"
        is_unread_={false}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={0}
        title_="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_unread_={true}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'lorem1', yields_: 8 },
          { id: 1, name_: 'lorem2', yields_: 8 },
          { id: 1, name_: 'lorem3', yields_: 8 },
          { id: 1, name_: 'lorem4', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
          { id: 1, name_: 'lorem3', yields_: 8 },
          { id: 1, name_: 'lorem4', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={0}
        title_="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_unread_={false}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={2}
        title_="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_unread_={true}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={2}
        title_="Lorem ipsum dolor sit amet"
        is_unread_={true}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        bookmark_id_={1}
        is_public_={true}
        points_={100}
        density_="default"
        stars_={2}
        is_unread_={true}
        tags_={[
          { id: 1, name_: 'lorem', yields_: 8 },
          { id: 1, name_: 'ipsum', yields_: 2 },
        ]}
        date_={new Date('2022-02-20')}
        on_click_={() => {}}
        on_selected_tag_click_={() => {}}
        on_tag_click_={() => {}}
        links_={[
          { url_: 'https://google.com', saves_: 99, menu_slot_: <>menu</> },
          {
            url_: 'https://github.com/lorem/ipsum',
            saves_: 99,
            menu_slot_: <>menu</>,
          },
        ]}
        favicon_host_="http://localhost:4000/v1/favicons"
        menu_slot_={<>menu</>}
        should_dim_visited_links_={false}
        updated_at_=""
        on_tag_drag_start_={() => {}}
        on_tag_delete_click_={() => {}}
        on_give_point_click_={() => {}}
        index_={0}
        library_url_=""
        created_at_={new Date()}
        on_get_points_given_click_={() => {}}
        on_link_click_={async () => {}}
        on_new_tab_link_click_={() => {}}
      />
      <StorybookSpacer />
    </div>
  </div>
)
