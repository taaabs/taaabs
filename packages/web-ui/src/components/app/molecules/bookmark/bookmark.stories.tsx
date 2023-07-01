import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { Bookmark } from './bookmark'

export default {
  component: Bookmark,
}

export const Primary = () => (
  <div
    style={{
      background: 'var(--library-background)',
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
        isStarred={false}
        visibility="private"
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={[]}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
        onVisibilityClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        visibility="private"
        title="Lorem ipsum dolor sit amet"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={[]}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        visibility="private"
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={['lorem', 'ipsum']}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        visibility="private"
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={['lorem', 'ipsum']}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={true}
        isArchived={true}
        tags={[
          'lorem1',
          'ipsum2',
          'lorem3',
          'ipsum4',
          'lorem5',
          'ipsum6',
          'lorem7',
          'ipsum8',
          'lorem9',
          'ipsum10',
          'lorem11',
          'ipsum12',
          'lorem13',
          'ipsum14',
          'lorem15',
          'ipsum16',
          'lorem17',
          'ipsum18',
          'lorem19',
          'ipsum20',
        ]}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={false}
        isArchived={true}
        tags={['lorem1', 'ipsum1', 'lorem2', 'ipsum2']}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
        onVisibilityClick={() => {}}
        visibility="public"
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odio sodal, euismod odio ac, fermentum metus."
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum']}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        site="example.com/test"
        createdAt={new Date('2023-02-20')}
        isNSFW={true}
        isArchived={true}
        tags={['lorem', 'ipsum']}
        saves={2200}
        onSiteClick={() => {}}
        onDateClick={() => {}}
        onSavesClick={() => {}}
      />
      <StorybookSpacer />
    </div>
  </div>
)
