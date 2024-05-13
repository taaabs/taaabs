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
        button_label_="Lorem"
        on_click_cancel_={() => {}}
        is_disabled_={false}
        translations_={{
          cancel_: 'Cancel',
        }}
      />
    </div>
  )
}
