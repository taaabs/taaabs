import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { Tags } from '.'
import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'

export default {
  component: Tags,
}

export const Primary = () => (
  <StorybookMargin>
    <div style={{ width: 260 }}>
      <Tags
        tags={{
          aa: 10,
          aaaa: 8,
          aaaaaa: 52,
          aaaaaaa: 1,
          aaaaaaaa:2,
          bb: 3,
          bbbb: 10,
          bbbbbb: 8,
        }}
        on_click={() => {}}
      />
      <StorybookSpacer />
      <Tags
        tags={{
          aa: 10,
          aaaa: 8,
          aaaaaa: 52,
          bb: 3,
          bbbb: 10,
          bbbbbb: 8,
        }}
        on_click={() => {}}
      />
    </div>
  </StorybookMargin>
)
