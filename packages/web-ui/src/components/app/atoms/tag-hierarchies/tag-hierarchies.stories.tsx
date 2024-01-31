import { TagHierarchies } from './tag-hierarchies'

export default {
  component: TagHierarchies,
}

export const Primary = () => {
  return (
    <TagHierarchies
      is_draggable={true}
      tree={[
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
      on_update={() => {}}
      on_item_click={() => {}}
      is_updating={false}
      selected_tag_ids={[1, 3, 5]}
      query_params=""
    />
  )
}
