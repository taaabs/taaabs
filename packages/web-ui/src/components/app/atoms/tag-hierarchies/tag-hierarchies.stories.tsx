import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { TagHierarchies } from './tag-hierarchies'

export default {
  component: TagHierarchies,
}

export const Primary = () => {
  return (
    <>
      <TagHierarchies
        is_interactive_={true}
        all_bookmarks_yields_={2137}
        is_all_bookmarks_selected_={false}
        on_click_all_bookmarks_={() => {}}
        tree_={[
          {
            name: 'AAA',
            id: 1,
            yields: 100,
            children: [
              {
                name: 'BBB',
                id: 2,
                yields: 50,
                children: [],
              },
              {
                name: 'CCC',
                id: 3,
                children: [
                  {
                    name: 'EEE',
                    id: 5,
                    children: [],
                  },
                  {
                    name: 'FFF',
                    id: 6,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            name: 'DDD',
            id: 4,
            children: [
              {
                name: 'GGG',
                id: 7,
                children: [],
              },
              {
                name: 'BBB',
                id: 2,
                children: [],
              },
            ],
          },
        ]}
        on_update_={() => {}}
        on_item_click_={() => {}}
        is_updating_={false}
        selected_tag_ids_={[1, 3, 5]}
        library_url_="/"
        translations_={{
          all_bookmarks_: 'All bookmarks',
          drag_here_: 'Drag and drop tags here',
        }}
      />
      <StorybookSpacer />
      No tree:
      <StorybookSpacer />
      <StorybookMargin>
        <TagHierarchies
          is_interactive_={true}
          all_bookmarks_yields_={2137}
          is_all_bookmarks_selected_={false}
          on_click_all_bookmarks_={() => {}}
          on_update_={() => {}}
          on_item_click_={() => {}}
          is_updating_={false}
          selected_tag_ids_={[1, 3, 5]}
          library_url_="/"
          translations_={{
            all_bookmarks_: 'All bookmarks',
            drag_here_: 'Drag and drop tags here',
          }}
        />
      </StorybookMargin>
    </>
  )
}
