'use client'
import { use_public_user_avatar } from '@/providers/PublicUserAvatarProvider'
import { useEffect } from 'react'

type Props = {
  avatar?: {
    url: string
    blurhash: string
  }
}

export const AvatarContextSetter: React.FC<Props> = (props) => {
  const public_user_avatar = use_public_user_avatar()

  useEffect(() => {
    if (props.avatar) {
      public_user_avatar?.set_avatar({
        url: props.avatar.url,
        blurhash: props.avatar.blurhash,
      })
    }

    return () => {
      public_user_avatar?.set_avatar(null)
    }
  }, [])

  return <></>
}
