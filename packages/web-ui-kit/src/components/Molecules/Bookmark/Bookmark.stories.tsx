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
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '50px',
      }}
    >
      <Bookmark
        isStarred={true}
        visibility="private"
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={['lorem', 'ipsum']}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        visibility="encrypted"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        createdAt={new Date('2023-02-20')}
        isNSFW={true}
        isArchived={true}
        tags={[
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
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        visibility="encrypted"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={['lorem', 'ipsum', 'lorem', 'ipsum']}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        createdAt={new Date('2023-02-20')}
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum']}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        visibility="private"
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        sitePath="test"
        createdAt={new Date('2023-02-20')}
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum']}
      />

      <StorybookSpacer />
    </div>
  </div>
)
