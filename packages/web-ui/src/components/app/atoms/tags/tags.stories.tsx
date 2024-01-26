import { Tags } from '.'
import { StorybookMargin, StorybookSpacer } from '@web-ui/helpers/storybook'

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
        on_tag_drag_start={() => {}}
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
        on_tag_drag_start={() => {}}
      />
    </div>
  </StorybookMargin>
)
