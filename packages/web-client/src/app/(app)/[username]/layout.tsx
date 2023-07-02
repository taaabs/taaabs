import { OtherUserStoreProvider } from './other-user-store-provider'
import { OtherUserStoreInitializer } from './other-user-store-initializer'
import { Metadata } from 'next'
import { getOtherUserMetadata } from '@/utils/getOtherUserMetadata'
import { AvatarContextSetter } from './avatar-context-setter'

const Layout: React.FC<{
  children: React.ReactNode
  params: { username: string }
}> = async (props) => {
  const metadata = await getOtherUserMetadata({
    username: props.params.username,
  })
  return (
    <OtherUserStoreProvider>
      <AvatarContextSetter
        avatar={
          metadata.avatar
            ? {
                url: metadata.avatar.url,
                blurhash: metadata.avatar.blurhash,
              }
            : undefined
        }
      />
      <OtherUserStoreInitializer>{props.children}</OtherUserStoreInitializer>
    </OtherUserStoreProvider>
  )
}

export default Layout

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  const username = params.username
  const metadata = await getOtherUserMetadata({ username })

  return {
    title: {
      default: `${metadata.displayName} (@${metadata.username}) | Taaabs`,
      template: `%s - ${metadata.displayName} (@${metadata.username}) | Taaabs`,
    },
  }
}
