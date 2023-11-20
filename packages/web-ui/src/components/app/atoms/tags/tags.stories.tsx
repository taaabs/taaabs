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
          aa: {
            id: 1,
            yields: 1,
          },
          aaaa: {
            id: 1,
            yields: 1,
          },
          aaaaaa: {
            id: 1,
            yields: 1,
          },
          aaaaaaa: {
            id: 1,
            yields: 1,
          },
          aaaaaaaa: {
            id: 1,
            yields: 1,
          },
          bb: {
            id: 1,
            yields: 1,
          },
          bbbb: {
            id: 1,
            yields: 1,
          },
          bbbbbb: {
            id: 1,
            yields: 1,
          },
        }}
        on_click={() => {}}
      />
      <StorybookSpacer />
      <Tags
        tags={{
          aa: {
            id: 1,
            yields: 1,
          },
          aaaa: {
            id: 1,
            yields: 1,
          },
          aaaaaa: {
            id: 1,
            yields: 1,
          },
          bb: {
            id: 1,
            yields: 1,
          },
          bbbb: {
            id: 1,
            yields: 1,
          },
          bbbbbb: {
            id: 1,
            yields: 1,
          },
        }}
        on_click={() => {}}
      />
    </div>
  </StorybookMargin>
)
