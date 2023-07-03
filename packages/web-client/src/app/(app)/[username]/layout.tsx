import { OtherUserStoreProvider } from './other-user-store-provider'
import { Metadata } from 'next'
import { AvatarContextSetter } from './avatar-context-setter'
import { MetadataDataSourceImpl } from '@repositories/modules/metadata/infrastructure/data-sources/metadata-data-source-impl'
import { MetadataRepositoryImpl } from '@repositories/modules/metadata/infrastructure/repositories/metadata-repository-impl'
import { GetPublicMetadata } from '@repositories/modules/metadata/domain/usecases/get-public-metadata'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const Layout: React.FC<{
  children: React.ReactNode
  params: { username: string }
}> = async ({ children, params }) => {
  const metadata = await _getMetadata({ username: params.username })

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
      {children}
    </OtherUserStoreProvider>
  )
}

export default Layout

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  const metadata = await _getMetadata({ username: params.username })

  return {
    title: {
      default: `${metadata.displayName} (@${metadata.username}) | Taaabs`,
      template: `%s - ${metadata.displayName} (@${metadata.username}) | Taaabs`,
    },
  }
}

async function _getMetadata({ username }: { username: string }) {
  const dataSource = new MetadataDataSourceImpl(apiUrl)
  const repository = new MetadataRepositoryImpl(dataSource)
  const getMetadata = new GetPublicMetadata(repository)
  const metadata = await getMetadata.invoke({ username })
  return metadata
}
