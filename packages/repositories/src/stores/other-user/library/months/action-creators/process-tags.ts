import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, monthsActions } from '../months.slice'

export const processTags = ({
  yyyymmGte,
  yyyymmLte,
}: {
  yyyymmGte?: number
  yyyymmLte?: number
}) => {
  return (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const monthsData = getState().months.monthsData
    if (!monthsData) {
      throw 'Months data should be there.'
    }

    const getTags = (months: typeof monthsData.monthsOfBookmarkCreation) => {
      const monthsFiltered: typeof monthsData.monthsOfBookmarkCreation =
        Object.keys(months).reduce((acc, val) => {
          const yyyymm = parseInt(val)
          let shouldReturnVal = false

          if (yyyymmGte && yyyymmLte) {
            if (yyyymm >= yyyymmGte && yyyymm <= yyyymmLte) {
              shouldReturnVal = true
            }
          } else if (yyyymmGte && yyyymm >= yyyymmGte) {
            shouldReturnVal = true
          } else if (yyyymmLte && yyyymm <= yyyymmLte) {
            shouldReturnVal = true
          } else {
            shouldReturnVal = true
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

      Object.values(monthsFiltered).forEach((month) => {
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

      return sortedTags
    }

    dispatch(
      monthsActions.setTagsOfBookmarkCreation(
        getTags(monthsData.monthsOfBookmarkCreation),
      ),
    )
    dispatch(
      monthsActions.setTagsOfUrlCreation(
        getTags(monthsData.monthsOfUrlCreation),
      ),
    )
  }
}
