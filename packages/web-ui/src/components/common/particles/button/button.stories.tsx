import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { Button } from './button'

export default {
  component: Button,
}

export const Primary = () => (
  <StorybookMargin>
    Small:
    <br />
    <br />
    <Button size="small">Click me!</Button>
    <StorybookSpacer />
    Default:
    <br />
    <br />
    <Button>Click me!</Button>
    <StorybookSpacer />
    Large:
    <br />
    <br />
    <Button size="large">Click me!</Button>
  </StorybookMargin>
)
