import { Helpers } from '@web-ui'
import { SelectedTags } from '.'

export default {
  component: SelectedTags,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    <div style={{ width: 260 }}>
      <SelectedTags
        on_selected_tag_click={() => {}}
        selected_tags={[
          { id: 0, name: 'lorem' },
          { id: 0, name: 'ipsum' },
        ]}
      />
    </div>
  </Helpers.Storybook.StorybookMargin>
)
