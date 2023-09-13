import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, monthsActions } from '../months.slice'

export const processTags = () => {
  return (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const { monthsData, yyyymmGte, yyyymmLte } = getState().months
    if (!monthsData) {
      throw 'Months data should be there.'
    }

    const calculateTags = (
      months: typeof monthsData.monthsOfBookmarkCreation,
    ) => {
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
        Object.entries(month.tags).forEach(([name, details]) => {
          if (tags[name]) {
            tags[name] += details.yields
          } else {
            tags[name] = details.yields
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

    const tagsOfBookmarkCreation = calculateTags(
      monthsData.monthsOfBookmarkCreation,
    )
    const tagsOfUrlCreation = calculateTags(monthsData.monthsOfUrlCreation)

    dispatch(monthsActions.setTagsOfBookmarkCreation(tagsOfBookmarkCreation))
    dispatch(monthsActions.setTagsOfUrlCreation(tagsOfUrlCreation))
  }
}
