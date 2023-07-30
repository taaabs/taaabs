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
          compound: 10,
          mother: 8,
          field: 52,
          choose: 3,
          wire: 10,
          electronics: 8,
          flower: 52,
          review: 3,
          compact: 10,
          stubborn: 8,
          realize: 52,
          turn: 3,
          grandmother: 10,
          explode: 8,
          orbit: 52,
          drawing: 3,
        }}
        onClick={() => {}}
        onSelectedTagClick={() => {}}
        selectedTags={[]}
      />
      <StorybookSpacer />
      <Tags
        tags={{
          compound: 10,
          cccc: 1,
          mother: 8,
          field: 52,
          choose: 3,
          wire: 10,
          electronics: 8,
          flower: 52,
          review: 3,
          compact: 10,
          stubborn: 8,
          realize: 52,
          turn: 3,
          grandmother: 10,
          explode: 8,
          orbit: 52,
          drawing: 3,
        }}
        onClick={() => {}}
        onSelectedTagClick={() => {}}
        selectedTags={[
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
          'lorem',
          'ipsum',
        ]}
      />
    </div>
  </StorybookMargin>
)
