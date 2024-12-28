'use client'
import { createContext, useState, ReactNode, useContext } from 'react'

type PublicUserAvatarContext = {
  avatar: Avatar | undefined
  set_avatar: (avatar: Avatar | undefined) => void
}

export const PublicUserAvatarContext = createContext({} as PublicUserAvatarContext)

type Avatar = {
  url: string
  blurhash: string
}

type Props = {
  children?: ReactNode
}

export const use_public_user_avatar = () => useContext(PublicUserAvatarContext)

export const PublicUserAvatarProvider: React.FC<Props> = (props) => {
  const [avatar, set_avatar] = useState<Avatar>()

  return (
    <PublicUserAvatarContext.Provider value={{ avatar, set_avatar }}>
      {props.children}
    </PublicUserAvatarContext.Provider>
  )
}
