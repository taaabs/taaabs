import { Meta, StoryFn } from '@storybook/react'
import { TagsInput } from './TagsInput'
import { StorybookMargin } from '@web-ui/helpers/storybook'

export default {
  component: TagsInput,
} as Meta

const mock_on_selected_tags_update = (selected_tags: TagsInput.Tag[]) => {
  console.log('Selected tags updated:', selected_tags)
}
const mock_on_focus = () => {
  console.log('TagsInput focused')
}

const base_args: TagsInput.Props = {
  all_tags: [
    'React',
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
    'Node.js',
    'Express',
    'MongoDB',
  ],
  recent_tags: ['React', 'JavaScript', 'TypeScript'],
  max_tags: 5,
  is_visibility_toggleable: false,
  on_selected_tags_update: mock_on_selected_tags_update,
  on_focus: mock_on_focus,
  selected_tags: [],
  translations: {
    enter_tag_name: 'Enter tag name',
    add: 'Add',
  },
}

const Template: StoryFn<TagsInput.Props> = (args) => (
  <StorybookMargin>
    <TagsInput {...args} />
  </StorybookMargin>
)

export const Default = Template.bind({})
Default.args = {
  ...base_args,
  selected_tags: [
    { name: 'React', is_public: true },
    { name: 'JavaScript', is_public: true },
  ],
}

export const EmptyState = Template.bind({})
EmptyState.args = {
  ...base_args,
}

export const MaxTagsReached = Template.bind({})
MaxTagsReached.args = {
  ...base_args,
  selected_tags: [
    { name: 'React', is_public: true },
    { name: 'JavaScript', is_public: true },
    { name: 'TypeScript', is_public: true },
    { name: 'HTML', is_public: true },
    { name: 'CSS', is_public: true },
  ],
  max_tags: 5,
}

export const WithVisibilityControl = Template.bind({})
WithVisibilityControl.args = {
  ...base_args,
  is_visibility_toggleable: true,
  selected_tags: [
    { name: 'React', is_public: true },
    { name: 'JavaScript', is_public: false },
    { name: 'TypeScript', is_public: true },
  ],
}
