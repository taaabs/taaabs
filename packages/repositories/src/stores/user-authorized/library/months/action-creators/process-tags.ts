import { LibraryDispatch, LibraryState } from '../../library.store'
import { Tags, months_actions } from '../months.slice'

export const process_tags = () => {
  return (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const { months_data: monthsData, yyyymm_gte: yyyymmGte, yyyymm_lte: yyyymmLte } = getState().months
    if (!monthsData) {
      throw 'Months data should be there.'
    }

    const calculateTags = (months: typeof monthsData.created_at) => {
      const monthsFiltered: typeof monthsData.created_at = Object.keys(
        months,
      ).reduce((acc, val) => {
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

    const tagsOfBookmarkCreation = calculateTags(monthsData.created_at)
    const tagsOfUrlCreation = calculateTags(monthsData.updated_at)

    dispatch(months_actions.set_tags_of_bookmark_creation(tagsOfBookmarkCreation))
    dispatch(months_actions.set_tags_of_url_creation(tagsOfUrlCreation))
  }
}
