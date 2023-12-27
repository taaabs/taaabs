import { Helpers } from '@web-ui'
import { RadioSetting } from './radio-setting'

export default {
  component: RadioSetting,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
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
        <Helpers.Storybook.StorybookSpacer />
        <RadioSetting top_line="Lorem" on_click={() => {}} />
        <Helpers.Storybook.StorybookSpacer />
        <RadioSetting
          top_line="Lorem"
          bottom_line="ipsum"
          on_click={() => {}}
          is_checked={true}
        />
      </div>
    </Helpers.Storybook.StorybookMargin>
  )
}
