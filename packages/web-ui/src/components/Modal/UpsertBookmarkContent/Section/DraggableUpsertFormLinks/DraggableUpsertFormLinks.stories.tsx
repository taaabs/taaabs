import { StorybookMargin } from '@web-ui/helpers/storybook'
import { DraggableUpsertFormLinks } from './DraggableUpsertFormLinks'

export default {
  component: DraggableUpsertFormLinks,
}

export const Primary = () => (
  <StorybookMargin>
    <DraggableUpsertFormLinks
      links={[
        { url: 'https://lorem.com', is_public: true },
        { url: 'https://ipsum.com', is_public: false },
      ]}
      on_change={() => {}}
      show_visibility_toggler={true}
      translations={{
        add: 'Add',
        paste_url: 'Paste URL',
        site: 'Site',
        open: 'Open...',
        original_url: 'Original URL',
        snapshot: 'Snapshot',
        visibility: 'Visibility',
        private: 'Private',
        public: 'Public',
      }}
    />
  </StorybookMargin>
)
