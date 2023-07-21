import { OrderBy } from '@shared/types/modules/bookmarks/order-by'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, monthsActions } from '../months.slice'

export const processTags = ({
  orderBy,
  yyyymmGte,
  yyyymmLte,
}: {
  orderBy: OrderBy
  yyyymmGte?: number
  yyyymmLte?: number
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

    // Filter out months out of yyyymmGte and yyyymmLte range.
    months = Object.keys(months).reduce((acc, val) => {
      const yyyymm = parseInt(val)
      let shouldReturnVal = true

      if (yyyymmGte && yyyymmLte) {
        if (yyyymm < yyyymmGte || yyyymm > yyyymmLte) {
          shouldReturnVal = false
        }
      } else if (yyyymmGte && yyyymm < yyyymmGte) {
        shouldReturnVal = false
      } else if (yyyymmLte && yyyymm > yyyymmLte) {
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

    const sortedTags = Object.fromEntries(
      Object.keys(tags)
        .sort()
        .map((key) => [key, tags[key]]),
    )

    dispatch(monthsActions.setTags(sortedTags))
  }
}
