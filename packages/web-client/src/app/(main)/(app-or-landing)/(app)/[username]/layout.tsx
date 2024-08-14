import { Metadata } from 'next'
import { AvatarContextSetter } from './avatar-context-setter'
import { Metadata_DataSourceImpl } from '@repositories/modules/metadata/infrastructure/data-sources/metadata-data-source-impl'
import { MetadataRepositoryImpl } from '@repositories/modules/metadata/infrastructure/repositories/metadata-repository-impl'
import ky from 'ky'
import { FollowUnfollowProvider } from './follow-unfollow-provider'
import { LocalDbProvider } from '@/providers/LocalDbProvider'

const Layout: React.FC<{
  children: React.ReactNode
  params: { username: string }
}> = async (props) => {
  const metadata = await _get_metadata({ username: props.params.username })

  return (
    <LocalDbProvider>
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
      <FollowUnfollowProvider>{props.children}</FollowUnfollowProvider>
    </LocalDbProvider>
  )
}

export default Layout

// eslint-disable-next-line
export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  const metadata = await _get_metadata({ username: params.username })

  return {
    title: {
      default: `${metadata.display_name} (@${metadata.username}) | Taaabs`,
      template: `%s - ${metadata.display_name} (@${metadata.username}) | Taaabs`,
    },
  }
}

async function _get_metadata({ username }: { username: string }) {
  return {
    display_name: 'x',
    username: 'y',
  }
  const ky_instance = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  })
  const data_source = new Metadata_DataSourceImpl(ky_instance)
  const repository = new MetadataRepositoryImpl(data_source)
  const metadata = await repository.get_public({ username })
  return metadata
}
