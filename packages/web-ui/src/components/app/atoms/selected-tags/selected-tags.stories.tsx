import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { SelectedTags } from '.'

export default {
  component: SelectedTags,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <SelectedTags
        on_selected_tag_click={() => {}}
        selected_tags={[
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
        ]}
      />
    </div>
  </StorybookMargin>
)
