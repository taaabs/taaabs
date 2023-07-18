import { LibraryDispatch, LibraryState } from '../../library.store'

export const processTags = ({
  yymmStart,
  yymmEnd,
}: {
  yymmStart?: number
  yymmEnd?: number
}) => {
  return (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const monthsData = getState().months.data
    if (!monthsData) {
      throw 'Months data should be there.'
    }
    // It's not important whether we work on "of bookmarks" or "of url"
    const months = monthsData.monthsOfBookmarkCreation
    // filter out months out of yymmStart and yymmEnd
    // sum tags
  }
}
