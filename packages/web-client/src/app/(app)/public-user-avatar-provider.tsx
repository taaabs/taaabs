'use client'

import { createContext, useState } from 'react'

export const PublicUserAvatarContext = createContext<{
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

export const PublicUserAvatarProvider: React.FC<Props> = (props) => {
  const [avatar, setAvatar] = useState<Avatar | null>(null)

  return (
    <PublicUserAvatarContext.Provider value={{ avatar, setAvatar }}>
      {props.children}
    </PublicUserAvatarContext.Provider>
  )
}
