import { StorybookSpacer } from '@/helpers/storybook/StorybookSpacer'
import { Bookmark } from './Bookmark'
import { colors } from '@/styles/constants'

export default {
  component: Bookmark,
}

export const Primary = () => (
  <div
    style={{
      background: colors.neutral[25],
    }}
  >
    <div
      style={{
        padding: '50px 250px',
      }}
    >
      <Bookmark
        isStarred={false}
        visibility="public"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        added={new Date('2023-02-20')}
        addedFormat="timeAgo"
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum', 'lorem', 'ipsum']}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        visibility="public"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        added={new Date('2023-02-20')}
        addedFormat="timeAgo"
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum']}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        visibility="public"
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        added={new Date('2023-02-20')}
        addedFormat="timeAgo"
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum']}
      />
    </div>
  </div>
)
