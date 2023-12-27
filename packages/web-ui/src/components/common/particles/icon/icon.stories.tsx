import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { Icon } from './icon'
import styles from './icon-stories.module.scss'

export default {
  component: Icon,
}

export const Icons = () => (
  <StorybookMargin>
    <div className={styles.container}>
      <Icon variant={'ADD'} />
      <StorybookSpacer />
      <Icon variant={'BOOKMARK'} />
      <StorybookSpacer />
      <Icon variant={'GREATER_THAN'} />
      <StorybookSpacer />
      <Icon variant={'HOME'} />
      <StorybookSpacer />
      <Icon variant={'MOBILE_TITLE_BAR_MENU'} />
      <StorybookSpacer />
      <Icon variant={'MOBILE_TITLE_BAR_VIEW_OPTIONS'} />
      <StorybookSpacer />
      <Icon variant={'SEARCH'} />
      <StorybookSpacer />
      <Icon variant={'STAR_FILLED'} />
      <StorybookSpacer />
      <Icon variant={'STAR'} />
      <StorybookSpacer />
      <Icon variant={'SUN'} />
      <StorybookSpacer />
      <Icon variant={'USER_ADD'} />
      <StorybookSpacer />
      <Icon variant={'USER_REMOVE'} />
      <StorybookSpacer />
      <Icon variant={'USER'} />
      <StorybookSpacer />
    </div>
  </StorybookMargin>
)
