import { TagHierarchies } from './tag-hierarchies'

export default {
  component: TagHierarchies,
}

export const Primary = () => {
  return (
    <TagHierarchies
      tree={[
        {
          name: 'AAA',
          children: [
            {
              name: 'BBB',
              children: [],
            },
            {
              name: 'CCC',
              children: [
                {
                  name: 'EEE',
                  children: [],
                },
                {
                  name: 'FFF',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'DDD',
          children: [
            {
              name: 'GGG',
              children: [],
            },
            {
              name: 'BBB',
              children: [],
            },
          ],
        },
      ]}
      on_update={() => {}}
      on_item_click={() => {}}
    />
  )
}
