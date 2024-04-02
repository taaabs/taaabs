'use client'

import { HomeHero as UiLandingSection_HomeHero } from '@web-ui/components/landing/sections/home-hero'
import Link from 'next/link'

const Page: React.FC = () => {
  return (
    <>
      <UiLandingSection_HomeHero
        heading={{
          first_line: 'The huggiest',
          second_line: 'social bookmarking',
        }}
        subheading="Easy to use, privacy-first way to organize, share and discover web bookmarks"
        on_username_change={() => {}}
        claim_username_button_label="Claim username"
        claim_username_placeholder="username"
        on_claim_username_button_click={() => {}}
        ticks={[
          <>
            <strong>End-to-end encryption</strong> of private bookmarks
          </>,
          <>
            <strong>Free forever</strong> for core features
          </>,
        ]}
        username=""
      />
    </>
  )
}

export default Page
