import { GetPublicMetadata } from '@/modules/metadata/domain/usecases/get-public-metadata'
import { MetadataDataSourceImpl } from '@/modules/metadata/infrastructure/data-sources/metadata-data-source-impl'
import { MetadataRepositoryImpl } from '@/modules/metadata/infrastructure/repositories/metadata-repository-impl'
import { AppDispatch } from '@/stores/other-user/other-user.store'
import axios from 'axios'
import { metadataActions } from '../metadata.slice'

export const fetchMetadata = (username: string) => {
  return async (dispatch: AppDispatch) => {
    const dataSource = new MetadataDataSourceImpl(axios)
    const repository = new MetadataRepositoryImpl(dataSource)
    const getMetadata = new GetPublicMetadata(repository)

    const metadata = await getMetadata.invoke({
      username,
    })

    dispatch(metadataActions.setMetadata(metadata))
    dispatch(metadataActions.setIsFetchingMetadata(false))
  }
}
