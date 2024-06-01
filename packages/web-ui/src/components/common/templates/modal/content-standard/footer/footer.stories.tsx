import { StorybookSpacer } from '@web-ui/helpers/storybook'
import { Footer } from './footer'

export default {
  component: Footer,
}

export const Primary = () => {
  return (
    <div>
      <StorybookSpacer />
      <Footer
        button_label="Lorem"
        on_click_cancel={() => {}}
        is_disabled={false}
        translations={{
          cancel: 'Cancel',
        }}
      />
    </div>
  )
}
