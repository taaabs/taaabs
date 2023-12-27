import { Helpers, Ui } from '@web-ui'
import { Icon } from './icon'
import styles from './icon-stories.module.scss'

export default {
  component: Icon,
}

export const Icons = () => (
  <Helpers.Storybook.StorybookMargin>
    <div className={styles.container}>
      <Ui.Common.Particles.Icon variant={'ADD'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'BOOKMARK'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'GREATER_THAN'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'HOME'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'SEARCH'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'STAR_FILLED'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'STAR'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'SUN'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'USER_ADD'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'USER_REMOVE'} />
      <Helpers.Storybook.StorybookSpacer />
      <Ui.Common.Particles.Icon variant={'USER'} />
      <Helpers.Storybook.StorybookSpacer />
    </div>
  </Helpers.Storybook.StorybookMargin>
)
