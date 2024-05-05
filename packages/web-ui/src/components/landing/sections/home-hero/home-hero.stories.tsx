import { HomeHero } from './about-hero'

export default {
  component: HomeHero,
}

export const Primary = () => (
  <HomeHero
    heading={{ first_line: 'The huggiest', second_line: 'social bookmarking' }}
    subheading={
      'Easy to use, privacy-first way to organize, share and discover web bookmarks'
    }
    claim_username_button_label="Claim username"
    claim_username_placeholder="username"
    on_claim_username_button_click={() => {}}
    username=""
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
