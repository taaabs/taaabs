import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { LibraryDispatch, LibraryState } from '../../library.store'

export const processTags = ({
  orderBy,
  yymmStart,
  yymmEnd,
}: {
  orderBy: OrderBy
  yymmStart?: number
  yymmEnd?: number
}) => {
  return (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const monthsData = getState().months.data
    if (!monthsData) {
      throw 'Months data should be there.'
    }
    let months = 
    const months = monthsData.monthsOfBookmarkCreation
    // filter out months out of yymmStart and yymmEnd
    // sum tags
  }
}
