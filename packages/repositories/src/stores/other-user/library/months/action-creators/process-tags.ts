import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, monthsActions } from '../months.slice'

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

    let months: typeof monthsData.monthsOfUrlCreation
    switch (orderBy) {
      case OrderBy.BookmarkCreationDate:
        months = monthsData.monthsOfBookmarkCreation
        break
      case OrderBy.UrlCreationDate:
        months = monthsData.monthsOfUrlCreation
        break
    }

    // Filter out months out of yymmStart and yymmEnd range.
    months = Object.keys(months).reduce((acc, val) => {
      const yymm = parseInt(val)
      let shouldReturnVal = true

      if (yymmStart && yymmEnd) {
        if (yymm < yymmStart || yymm > yymmEnd) {
          shouldReturnVal = false
        }
      } else if (yymmStart && yymm < yymmStart) {
        shouldReturnVal = false
      } else if (yymmEnd && yymm > yymmEnd) {
        shouldReturnVal = false
      }

      if (shouldReturnVal) {
        return {
          ...acc,
          [val]: months[val],
        }
      } else {
        return {
          ...acc,
        }
      }
    }, {})

    const tags: Tags = {}

    Object.values(months).forEach((month) => {
      Object.entries(month.tags).forEach(([name, count]) => {
        if (tags[name]) {
          tags[name] += count
        } else {
          tags[name] = count
        }
      })
    })

    dispatch(monthsActions.setTags(tags))
  }
}
