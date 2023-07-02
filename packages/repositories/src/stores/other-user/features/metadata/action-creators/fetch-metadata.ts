import { GetPublicMetadata } from '@repositories/modules/metadata/domain/usecases/get-public-metadata'
import { MetadataDataSourceImpl } from '@repositories/modules/metadata/infrastructure/data-sources/metadata-data-source-impl'
import { MetadataRepositoryImpl } from '@repositories/modules/metadata/infrastructure/repositories/metadata-repository-impl'
import { AxiosInstance } from 'axios'
import { metadataActions } from '../metadata.slice'
import { OtherUserDispatch } from '@repositories/stores/other-user/other-user.store'

export const fetchMetadata = (username: string, axios: AxiosInstance) => {
  return async (dispatch: OtherUserDispatch) => {
    const dataSource = new MetadataDataSourceImpl(axios)
    const repository = new MetadataRepositoryImpl(dataSource)
    const getMetadata = new GetPublicMetadata(repository)

    dispatch(metadataActions.setIsFetchingMetadata(true))
    const metadata = await getMetadata.invoke({
      username,
    })
    dispatch(metadataActions.setMetadata(metadata))
    dispatch(metadataActions.setIsFetchingMetadata(false))
  }
}
