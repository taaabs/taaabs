import { HomeHero } from './home-hero'

export default {
  component: HomeHero,
}

export const Primary = () => (
  <HomeHero
    heading={{ first_line: 'The huggiest', second_line: 'social bookmarking' }}
    subheading={
      'Easy to use, privacy-first way to organize, share and discover web bookmarks'
    }
    claim_username={{
      username: '',
      button_label: 'Claim username',
      button_on_click: () => {},
      placeholder: 'username',
    }}
    on_username_change={() => {}}
    ticks={[
      <>
        <strong>End-to-end encryption</strong> of private bookmarks
      </>,
      <>
        <strong>Free forever</strong> for core features
      </>,
    ]}
  />
)
