'use client'

import { Dictionary } from '@/dictionaries/dictionary'
import { SectionUsername } from './SectionUsername'
import { SectionDeleteAccount } from './SectionDeleteAccount'
import { useContext } from 'react'
import { AuthContext } from '@/providers/AuthProvider'

export const General: React.FC<{ dictionary: Dictionary }> = (props) => {
  const auth_context = useContext(AuthContext)
  return (
    <>
      {auth_context.auth_data?.username && (
        <SectionUsername dictionary={props.dictionary} />
      )}
      <SectionDeleteAccount
        dictionary={props.dictionary}
        is_guest_account={auth_context.auth_data?.username ? false : true}
      />
    </>
  )
}
