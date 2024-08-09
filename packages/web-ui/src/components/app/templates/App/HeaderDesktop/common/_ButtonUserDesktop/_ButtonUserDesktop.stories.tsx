import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'
import { _ButtonUserDesktop } from './_ButtonUserDesktop'

export default {
  component: _ButtonUserDesktop,
}

export const Primary = () => (
  <StorybookMargin>
    <_ButtonUserDesktop
      name="Lorem ipsum"
      avatar={{
        url: 'https://picsum.photos/300',
        blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
      }}
      on_click={() => {}}
    />
    <StorybookSpacer />
    <_ButtonUserDesktop
      avatar={{
        url: 'https://picsum.photos/300',
        blurhash: 'KGF5?xYk^6@-5c,1@[or[Q',
      }}
      on_click={() => {}}
    />
    <StorybookSpacer />
    <_ButtonUserDesktop name="Lorem ipsum" on_click={() => {}} />
  </StorybookMargin>
)
