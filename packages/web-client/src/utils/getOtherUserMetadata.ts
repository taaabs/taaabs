import { axiosInstance } from '@/config/axios-config'
import { GetPublicMetadata } from '@repositories/modules/metadata/domain/usecases/get-public-metadata'
import { MetadataDataSourceImpl } from '@repositories/modules/metadata/infrastructure/data-sources/metadata-data-source-impl'
import { MetadataRepositoryImpl } from '@repositories/modules/metadata/infrastructure/repositories/metadata-repository-impl'
import { cache } from 'react'

export const getOtherUserMetadata = cache(
  async ({ username }: { username: string }) => {
    const dataSource = new MetadataDataSourceImpl(axiosInstance)
    const repository = new MetadataRepositoryImpl(dataSource)
    const getMetadata = new GetPublicMetadata(repository)

    return await getMetadata.invoke({ username })
  },
)
