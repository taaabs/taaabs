'use client'

import { createContext, useState } from 'react'

export const OtherUserAvatarContext = createContext<{
  avatar: Avatar | null
  setAvatar: (avatar: Avatar | null) => void
} | null>(null)

type Avatar = {
  url: string
  blurhash: string
}

type Props = {
  children?: React.ReactNode
}

export const OtherUserAvatarProvider: React.FC<Props> = (props) => {
  const [avatar, setAvatar] = useState<Avatar | null>(null)

  return (
    <OtherUserAvatarContext.Provider value={{ avatar, setAvatar }}>
      {props.children}
    </OtherUserAvatarContext.Provider>
  )
}
