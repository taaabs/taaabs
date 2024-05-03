import { StorybookMargin } from '@web-ui/helpers/storybook'
import { DraggableUpsertFormTags } from './draggable-upsert-form-tags'

export default {
  component: DraggableUpsertFormTags,
}

export const Primary = () => (
  <StorybookMargin>
    <DraggableUpsertFormTags
      tags_={[
        { name_: 'aaa', is_public_: true },
        { name_: 'bbb', is_public_: false },
      ]}
      on_change_={() => {}}
      show_visibility_toggler_={true}
      translations_={{
        add_: 'Lorem ipsum',
        private_: 'Private',
        public_: 'Public',
        visibility_: 'Visibility',
      }}
    />
  </StorybookMargin>
)
