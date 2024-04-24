import { StorybookMargin } from '@web-ui/helpers/storybook'
import { SegmentedButton } from './segmented-button'

export default {
  component: SegmentedButton,
}

export const Primary = () => (
  <StorybookMargin>
    <SegmentedButton
      items={[
        { label: 'aa', is_selected: false },
        { label: 'aaaaaaa', is_selected: true },
        { label: 'aaaaa', is_selected: false },
      ]}
      on_item_click={() => {}}
    />
  </StorybookMargin>
)
