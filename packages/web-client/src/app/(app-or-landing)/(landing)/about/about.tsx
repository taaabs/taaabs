'use client'

import { HomeHero as UiLandingSection_HomeHero } from '@web-ui/components/landing/sections/home-hero'

const About: React.FC<{ is_authorized: boolean }> = (props) => {
  return (
    <>
      <UiLandingSection_HomeHero
        heading={{
          first_line: 'The huggiest',
          second_line: 'social bookmarking',
        }}
        subheading="Easy to use, privacy-first way to organize, share and discover web bookmarks"
        on_username_change={() => {}}
        claim_username={
          !props.is_authorized
            ? {
                button_label: 'Claim username',
                placeholder: 'username',
                button_on_click: () => {},
                username: '',
              }
            : undefined
        }
        ticks={[
          <>
            <strong>End-to-end encryption</strong> of private bookmarks
          </>,
          <>
            <strong>Free to try</strong> for as long as you'd like
          </>,
        ]}
      />
    </>
  )
}

export default About
