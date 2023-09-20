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
    <>
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
    </>
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
      default: `${metadata.display_name} (@${metadata.username}) | Taaabs`,
      template: `%s - ${metadata.display_name} (@${metadata.username}) | Taaabs`,
    },
  }
}

async function _getMetadata({ username }: { username: string }) {
  const data_source = new MetadataDataSourceImpl(apiUrl)
  const repository = new MetadataRepositoryImpl(data_source)
  const get_metadata = new GetPublicMetadata(repository)
  const metadata = await get_metadata.invoke({ username })
  return metadata
}
