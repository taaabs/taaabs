import { Helpers, Ui } from '@web-ui'
import { Button } from './button'

export default {
  component: Button,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
    Small:
    <br />
    <br />
    <Ui.Common.Particles.Button size="small">
      Click me!
    </Ui.Common.Particles.Button>
    <Helpers.Storybook.StorybookSpacer />
    Default:
    <br />
    <br />
    <Ui.Common.Particles.Button>Click me!</Ui.Common.Particles.Button>
    <Helpers.Storybook.StorybookSpacer />
    Large:
    <br />
    <br />
    <Ui.Common.Particles.Button size="large">
      Click me!
    </Ui.Common.Particles.Button>
  </Helpers.Storybook.StorybookMargin>
)
