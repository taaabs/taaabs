import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { RadioSetting } from './radio-setting'

export default {
  component: RadioSetting,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'column',
        }}
      >
        <RadioSetting
          top_line="Lorem"
          bottom_line="ipsum"
          on_click={() => {}}
        />
        <StorybookSpacer />
        <RadioSetting top_line="Lorem" on_click={() => {}} />
        <StorybookSpacer />
        <RadioSetting
          top_line="Lorem"
          bottom_line="ipsum"
          on_click={() => {}}
          is_checked={true}
        />
      </div>
    </StorybookMargin>
  )
}
