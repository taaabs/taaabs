'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { SectionUsername } from './SectionUsername'
import { SectionDeleteAccount } from './SectionDeleteAccount'

export const Page: React.FC<{ dictionary: Dictionary }> = (props) => {
  return (
    <>
      <SectionUsername dictionary={props.dictionary} />
      <SectionDeleteAccount dictionary={props.dictionary} />
    </>
  )
}
