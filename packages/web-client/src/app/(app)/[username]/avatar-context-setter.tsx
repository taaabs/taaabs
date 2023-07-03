'use client'

import { useContext, useEffect } from 'react'
import { OtherUserAvatarContext } from '../other-user-avatar-provider'

type Props = {
  avatar?: {
    url: string
    blurhash: string
  }
}

export const AvatarContextSetter: React.FC<Props> = (props) => {
  const otherUserAvatar = useContext(OtherUserAvatarContext)

  useEffect(() => {
    if (props.avatar) {
      otherUserAvatar?.setAvatar({
        url: props.avatar.url,
        blurhash: props.avatar.blurhash,
      })
    }

    return () => {
      otherUserAvatar?.setAvatar(null)
    }
  }, [])

  return <></>
}
