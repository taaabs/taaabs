import { Area, AreaChart, Brush, ResponsiveContainer } from 'recharts'
import styles from './months.module.scss'
import useThrottledCallback from 'beautiful-react-hooks/useThrottledCallback'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import { useEffect, useState } from 'react'
import { useIsHydrated } from '@shared/hooks'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import dayjs from 'dayjs'

type Months = {
  yyyymm: number
  bookmarkCount: number
  starredCount: number
  nsfwCount: number
}[]

export namespace Months {
  export type Props = {
    months: Months | null
    currentGte?: number
    currentLte?: number
    onYyyymmChange: ({ gte, lte }: { gte: number; lte: number }) => void
    selectedTags?: string
  }
}

export const Months: React.FC<Months.Props> = (props) => {
  const isHydrated = useIsHydrated()
  const { swiping: isSwiping } = useSwipe(undefined, {
    preventDefault: false,
    passive: false,
    threshold: 0,
  })
  const [key, setKey] = useState('')
  const [startIndex, setStartIndex] = useState<number | undefined>(undefined)
  const [endIndex, setEndIndex] = useState<number | undefined>(undefined)
  const [draggedStartIndex, setDraggedStartIndex] = useState<
    number | undefined
  >(undefined)
  const [draggedEndIndex, setDraggedEndIndex] = useState<number | undefined>(
    undefined,
  )
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null)
  const [starredCount, setStarredCount] = useState<number | null>(null)
  const [nsfwCount, setNsfwCount] = useState<number | null>(null)

  useUpdateEffect(() => {
    if (
      isSwiping ||
      !props.months ||
      draggedStartIndex == undefined ||
      draggedEndIndex == undefined
    )
      return

    props.onYyyymmChange({
      gte: props.months[draggedStartIndex].yyyymm,
      lte: props.months[draggedEndIndex].yyyymm,
    })
  }, [isSwiping])

  const calculateCounts = ({
    months,
    startIndex,
    endIndex,
  }: {
    months: Months | null
    startIndex?: number
    endIndex?: number
  }) => {
    if (!months) return
    let monthsSliced: Months = []
    if (startIndex != undefined && endIndex != undefined) {
      monthsSliced = months.slice(startIndex, endIndex + 1)
    } else {
      monthsSliced = months
    }
    let bookmarkCount = 0
    let starredCount = 0
    let nsfwCount = 0
    monthsSliced.forEach((month) => {
      bookmarkCount += month.bookmarkCount
      starredCount += month.starredCount
      nsfwCount += month.nsfwCount
    })
    setBookmarkCount(bookmarkCount)
    setStarredCount(starredCount)
    setNsfwCount(nsfwCount)
  }

  const possibleStartIndex = ({
    months,
    currentGte,
  }: {
    months: Months
    currentGte: number
  }) => {
    const startIndex =
      months && currentGte
        ? months.find((month) => month.yyyymm == currentGte)
          ? months.findIndex((month) => month.yyyymm == currentGte)
          : months.findIndex((month) => {
              const monthsFiltered = months!.filter(
                (m) => m.yyyymm > currentGte!,
              )
              return monthsFiltered.length
                ? month.yyyymm ==
                    monthsFiltered
                      .map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - currentGte!) <
                        Math.abs(prev - currentGte!)
                          ? curr
                          : prev,
                      )
                : month.yyyymm ==
                    props
                      .months!.map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - currentGte!) <
                        Math.abs(prev - currentGte!)
                          ? curr
                          : prev,
                      )
            })
        : undefined

    return startIndex != -1 ? startIndex : undefined
  }

  const possibleEndIndex = ({
    months,
    currentLte,
  }: {
    months: Months
    currentLte: number
  }) => {
    const endIndex =
      months && currentLte
        ? months.find((month) => month.yyyymm == currentLte)
          ? months.findIndex((month) => month.yyyymm == currentLte)
          : months.findIndex((month) => {
              const monthsFiltered = months!.filter(
                (m) => m.yyyymm < currentLte!,
              )
              return monthsFiltered.length
                ? month.yyyymm ==
                    monthsFiltered
                      .map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - currentLte!) <
                        Math.abs(prev - currentLte!)
                          ? curr
                          : prev,
                      )
                : month.yyyymm ==
                    props
                      .months!.map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - currentLte!) <
                        Math.abs(prev - currentLte!)
                          ? curr
                          : prev,
                      )
            })
        : undefined

    return endIndex != -1 ? endIndex : undefined
  }

  const setStartAndEndIndex = ({
    months,
    currentGte,
    currentLte,
  }: {
    months: Months
    currentGte: number
    currentLte: number
  }) => {
    setStartIndex(possibleStartIndex({ months, currentGte }))

    setEndIndex(possibleEndIndex({ months, currentLte }))
  }

  const setStartAndEndIndexThrottled = useThrottledCallback(
    setStartAndEndIndex,
    [setStartIndex, setEndIndex],
    50,
  )

  const calculateCountsThrottled = useThrottledCallback(calculateCounts, [], 50)

  useUpdateEffect(() => {
    if (
      !props.months ||
      draggedStartIndex == undefined ||
      draggedEndIndex == undefined
    )
      return

    setStartAndEndIndexThrottled({
      months: props.months,
      currentGte: props.months[draggedStartIndex].yyyymm,
      currentLte: props.months[draggedEndIndex].yyyymm,
    })

    calculateCountsThrottled({
      months: props.months,
      startIndex: draggedStartIndex,
      endIndex: draggedEndIndex,
    })
  }, [draggedStartIndex, draggedEndIndex])

  useUpdateEffect(() => {
    calculateCounts({
      months: props.months,
      startIndex: startIndex,
      endIndex: endIndex,
    })
    if (!isSwiping) {
      setKey(`${startIndex || ''}${endIndex || ''}${props.selectedTags || ''}`)
    }
  }, [startIndex, endIndex])

  useEffect(() => {
    if (!props.months || !props.currentGte || !props.currentLte) {
      setKey(`${startIndex || ''}${endIndex || ''}${props.selectedTags || ''}`)
      setStartIndex(undefined)
      setEndIndex(undefined)

      return
    }

    setStartAndEndIndex({
      months: props.months,
      currentGte: props.currentGte,
      currentLte: props.currentLte,
    })
  }, [props.currentGte, props.currentLte, props.months, props.selectedTags])

  useEffect(() => {
    if (
      !props.months ||
      props.currentGte ||
      props.currentLte ||
      draggedStartIndex != undefined ||
      draggedEndIndex != undefined
    )
      return

    calculateCounts({
      months: props.months,
      startIndex: 0,
      endIndex: props.months.length - 1,
    })
  }, [props.months])

  return (
    <div className={styles.graph}>
      {props.months && props.months.length > 1 && (
        <div className={styles.graph__details}>
          <div className={styles.graph__details__title}>Date range</div>
          <div className={styles['graph__details__current-range']}>
            {startIndex != undefined &&
            props.months[startIndex] &&
            endIndex != undefined &&
            props.months[endIndex]
              ? _yyyymmToDisplay(props.months[startIndex].yyyymm) +
                (endIndex != startIndex
                  ? ` - ${_yyyymmToDisplay(props.months[endIndex].yyyymm)}`
                  : '')
              : 'All history'}
          </div>
          <div className={styles.graph__details__counts}>
            <div className={styles.graph__details__counts__total}>
              {bookmarkCount}
            </div>
            {starredCount != undefined && starredCount > 0 && (
              <div className={styles.graph__details__counts__starred}>
                {starredCount}
              </div>
            )}
            {nsfwCount != undefined && nsfwCount > 0 && (
              <div className={styles.graph__details__counts__nsfw}>
                {nsfwCount}
              </div>
            )}
          </div>
        </div>
      )}
      {isHydrated && props.months && props.months.length >= 2 && (
        <ResponsiveContainer width={'100%'} height={160} key={key}>
          <AreaChart margin={{ left: 0, top: 5 }} data={props.months}>
            <Area
              type="basis"
              dataKey="bookmarkCount"
              strokeWidth={0}
              fill="var(--Months-chart-fill)"
              fillOpacity={bookmarkCount == 0 ? 0 : 1}
              animationDuration={0}
            />
            <Area
              type="basis"
              dataKey="starredCount"
              strokeWidth={0}
              fill="var(--Months-chart-starred-fill)"
              fillOpacity={starredCount == 0 ? 0 : 1}
              animationDuration={0}
            />
            <Area
              type="basis"
              dataKey="bookmarkCount"
              strokeWidth={2}
              stroke="var(--Months-chart-stroke)"
              fill="transparent"
              animationDuration={0}
              strokeOpacity={bookmarkCount == 0 ? 0 : 1}
            />
            <Area
              type="basis"
              dataKey="nsfwCount"
              strokeWidth={2}
              stroke="var(--Months-chart-nsfw-stroke)"
              fill="transparent"
              animationDuration={0}
              strokeOpacity={nsfwCount == 0 ? 0 : 1}
            />
            <Brush
              startIndex={startIndex}
              endIndex={endIndex}
              height={40}
              travellerWidth={24}
              fill="transparent"
              onChange={({ startIndex, endIndex }) => {
                if (
                  startIndex == undefined ||
                  endIndex == undefined ||
                  !props.months
                )
                  return

                setDraggedStartIndex(startIndex)
                setDraggedEndIndex(endIndex)
              }}
              className={styles.graph__brush}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {props.months && props.months.length == 1 && (
        <div className={styles.graph__info}>
          All bookmarks are within one month
        </div>
      )}
      {props.months && props.months.length == 0 && (
        <div className={styles.graph__info}>There is nothing to plot</div>
      )}
      {!props.months && <div className={styles.graph__info}>Loading...</div>}
    </div>
  )
}

function _yyyymmToDisplay(yyyymm: number) {
  return dayjs(
    new Date(
      parseInt(yyyymm.toString().substring(0, 4)),
      parseInt(yyyymm.toString().substring(4, 6)) - 1,
    ),
  ).format('MMM YYYY')
}
