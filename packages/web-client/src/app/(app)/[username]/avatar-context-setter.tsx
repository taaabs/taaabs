'use client'
import { OtherUserAvatarContext } from '../other-user-avatar-provider'
import { useContext, useEffect } from 'react'

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
    } else {
      otherUserAvatar?.setAvatar(null)
    }
  }, [])

  return <></>
}
