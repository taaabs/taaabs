import { StorybookMargin } from '@web-ui/helpers/storybook'
import { DraggableUpsertFormTags } from './draggable-upsert-form-tags'

export default {
  component: DraggableUpsertFormTags,
}

export const Primary = () => (
  <StorybookMargin>
    <DraggableUpsertFormTags
      tags={[
        { name: 'aaa', is_public: true },
        { name: 'bbb', is_public: false },
      ]}
      on_change={() => {}}
      show_visibility_toggler={true}
      translations={{
        add: 'Lorem ipsum',
        private: 'Private',
        public: 'Public',
        visibility: 'Visibility',
      }}
    />
  </StorybookMargin>
)
