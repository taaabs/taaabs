import { StorybookSpacer } from '@web-ui/helpers/storybook/storybook-spacer'
import { Bookmark } from './bookmark'

export default {
  component: Bookmark,
}

export const Primary = () => (
  <div
    style={{
      background: 'var(--Library-background)',
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
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum/test/lorem_ipsum/test/lorem_ipsum/test/lorem_ipsum/test/lorem_ipsum/test/lorem_ipsum"
        isNsfw={false}
        isArchived={true}
        tags={[]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={false}
        isArchived={true}
        tags={[]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={false}
        isArchived={true}
        tags={[
          { name: 'lorem', yields: 8 },
          { name: 'ipsum', yields: 2, isSelected: true },
        ]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={false}
        isArchived={true}
        tags={[
          { name: 'lorem', yields: 8 },
          { name: 'ipsum', yields: 2 },
        ]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={true}
        isArchived={true}
        tags={[
          { name: 'lorem', yields: 8 },
          { name: 'lorem1', yields: 8 },
          { name: 'lorem2', yields: 8 },
          { name: 'lorem3', yields: 8 },
          { name: 'lorem4', yields: 8 },
          { name: 'ipsum', yields: 2 },
        ]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={false}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={false}
        isArchived={true}
        tags={[
          { name: 'lorem', yields: 8 },
          { name: 'ipsum', yields: 2 },
        ]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={true}
        isArchived={true}
        tags={[
          { name: 'lorem', yields: 8 },
          { name: 'ipsum', yields: 2 },
        ]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        isStarred={true}
        title="Lorem ipsum dolor sit amet"
        url="https://example.com/test/lorem_ipsum"
        isNsfw={true}
        isArchived={true}
        tags={[
          { name: 'lorem', yields: 8 },
          { name: 'ipsum', yields: 2 },
        ]}
        saves={2200}
        onClick={() => {}}
        onMenuClick={() => {}}
      />
      <StorybookSpacer />
    </div>
  </div>
)
