import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { TagsInput } from './TagsInput'

export default {
  component: TagsInput,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ maxWidth: '300px' }}>
        <TagsInput
          all_tags={['aaa', 'bbb', 'ccc', 'ddd']}
          on_selected_tags_update={() => {}}
          recent_tags={['aaa', 'ddd']}
          selected_tags={[]}
          is_visibility_toggleable={false}
          max_tags={8}
          on_focus={() => {}}
          translations={{
            create: 'Create',
            enter_tag_name: 'Enter tag name',
          }}
        />
      </div>
      <StorybookSpacer />
      <div style={{ maxWidth: '300px' }}>
        <TagsInput
          all_tags={['aaa', 'bbb', 'ccc', 'ddd', 'Lorem ipsum^%$@ ipsum']}
          on_selected_tags_update={() => {}}
          recent_tags={['aaa', 'ddd']}
          selected_tags={[{ name: 'aaa' }, { name: 'bbb' }]}
          is_visibility_toggleable={true}
          max_tags={8}
          on_focus={() => {}}
          translations={{
            create: 'Create',
            enter_tag_name: 'Enter tag name',
          }}
        />
      </div>
    </StorybookMargin>
  )
}
