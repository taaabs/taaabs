'use client'

import { useContext, useEffect } from 'react'
import { PublicUserAvatarContext } from '../public-user-avatar-provider'

type Props = {
  avatar?: {
    url: string
    blurhash: string
  }
}

export const AvatarContextSetter: React.FC<Props> = (props) => {
  const publicUserAvatar = useContext(PublicUserAvatarContext)

  useEffect(() => {
    if (props.avatar) {
      publicUserAvatar?.setAvatar({
        url: props.avatar.url,
        blurhash: props.avatar.blurhash,
      })
    }

    return () => {
      publicUserAvatar?.setAvatar(null)
    }
  }, [])

  return <></>
}
