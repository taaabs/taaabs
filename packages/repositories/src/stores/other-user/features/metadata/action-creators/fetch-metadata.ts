import { GetPublicMetadata } from '@repositories/modules/metadata/domain/usecases/get-public-metadata'
import { MetadataDataSourceImpl } from '@repositories/modules/metadata/infrastructure/data-sources/metadata-data-source-impl'
import { MetadataRepositoryImpl } from '@repositories/modules/metadata/infrastructure/repositories/metadata-repository-impl'
import { Dispatch } from '@repositories/stores/other-user/other-user.store'
import axios from 'axios'
import { metadataActions } from '../metadata.slice'

export const fetchMetadata = (username: string) => {
  return async (dispatch: Dispatch) => {
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
