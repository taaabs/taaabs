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
        index={22}
        id="1"
        is_starred={false}
        title="Lorem ipsum dolor sit amet"
        is_nsfw={false}
        tags={[]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          {
            url: 'https://foooooooooooooooooooooooooooooooooooooooo.com/baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaar',
            saves: 99,
          },
          { url: 'https://foo.com/bar/baz', site_path: 'bar', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={false}
        title="Lorem ipsum dolor sit amet"
        is_nsfw={false}
        tags={[]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={false}
        title="Lorem ipsum dolor sit amet"
        is_nsfw={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', isSelected: true },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={true}
        title="Lorem ipsum dolor sit amet"
        is_nsfw={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={false}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_nsfw={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'lorem1', yields: 8 },
          { id: 1, name: 'lorem2', yields: 8 },
          { id: 1, name: 'lorem3', yields: 8 },
          { id: 1, name: 'lorem4', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
          { id: 1, name: 'lorem3', yields: 8 },
          { id: 1, name: 'lorem4', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={false}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_nsfw={false}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={true}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non odi sodal, euismod, fermentum metus"
        is_nsfw={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
      <Bookmark
        index={22}
        id="1"
        is_starred={true}
        title="Lorem ipsum dolor sit amet"
        is_nsfw={true}
        tags={[
          { id: 1, name: 'lorem', yields: 8 },
          { id: 1, name: 'ipsum', yields: 2 },
        ]}
        date={new Date('2022-02-20')}
        on_click={() => {}}
        on_menu_click={() => {}}
        on_selected_tag_click={() => {}}
        on_tag_click={() => {}}
        links={[
          { url: 'https://foo.com', saves: 99 },
          { url: 'https://bar.com/lorem/ipsum', saves: 99 },
        ]}
        set_render_height={() => {}}
      />
      <StorybookSpacer />
    </div>
  </div>
)
