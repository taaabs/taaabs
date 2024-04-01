import { Tags } from '.'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: Tags,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <Tags
        tags={[
          { name: 'a', id: 1, yields: 1 },
          { name: 'aa', id: 1, yields: 12},
          { name: 'b', id: 1, yields: 1 },
          { name: 'bb', id: 1, yields: 1 },
        ]}
        on_click={() => {}}
        on_tag_drag_start={() => {}}
      />
    </div>
  </StorybookMargin>
)
