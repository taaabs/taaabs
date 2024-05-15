'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { SectionUsername } from './section-username'

export const Settings: React.FC<{ dictionary: Dictionary }> = (props) => {
  return (
    <>
      <SectionUsername dictionary={props.dictionary} />
    </>
  )
}
