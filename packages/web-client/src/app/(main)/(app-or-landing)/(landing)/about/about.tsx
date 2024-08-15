'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { HomeHero as Ui_landing_section_HomeHero } from '@web-ui/components/landing/sections/HomeHero'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const About: React.FC<{ dictionary: Dictionary; is_authorized: boolean }> = (
  props,
) => {
  const [username, set_username] = useState('')
  const router = useRouter()
  return (
    <>
      <Ui_landing_section_HomeHero
        heading={{
          first_line: props.dictionary.landing.about.hero.heading.first_line,
          second_line: props.dictionary.landing.about.hero.heading.second_line,
        }}
        subheading={props.dictionary.landing.about.hero.subheading}
        on_username_change={set_username}
        claim_username={
          !props.is_authorized
            ? {
                button_label:
                  props.dictionary.landing.about.hero.claim_username,
                placeholder: props.dictionary.landing.about.hero.username,
                button_on_click: () => {
                  router.push(`/signup?username=${username}`)
                },
                username: username,
                incentive: props.dictionary.landing.about.hero.incentive,
              }
            : undefined
        }
        ticks={props.dictionary.landing.about.hero.ticks}
      />
    </>
  )
}

export default About
