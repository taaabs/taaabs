import { Helpers } from '@web-ui'
import { Tags } from '.'

export default {
  component: Tags,
}

export const Primary = () => (
  <Helpers.Storybook.StorybookMargin>
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
      <Helpers.Storybook.StorybookSpacer />
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
  </Helpers.Storybook.StorybookMargin>
)
