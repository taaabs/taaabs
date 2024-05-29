import { Tags } from '.'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: Tags,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <Tags
        tags_={[
          { name: 'a', id: 1, yields: 1 },
          { name: 'aa', id: 1, yields: 12 },
          { name: 'b', id: 1, yields: 1 },
          { name: 'bb', id: 1, yields: 1 },
        ]}
        on_click_={() => {}}
        on_tag_drag_start_={() => {}}
        library_url_=""
        translations_={{
          rename_: 'Rename',
        }}
      />
    </div>
  </StorybookMargin>
)
