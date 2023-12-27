import { Button } from './button'
import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'

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
