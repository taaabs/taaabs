import { Area, AreaChart, Brush, ResponsiveContainer, YAxis } from 'recharts'
import styles from './months.module.scss'
import useThrottledCallback from 'beautiful-react-hooks/useThrottledCallback'
import useSwipe from 'beautiful-react-hooks/useSwipe'
import { memo, useEffect, useRef, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import dayjs from 'dayjs'
import { Icon } from '@web-ui/components/common/particles/icon'

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
    clearDateRange: () => void
    selectedTags?: string
    hasResults?: boolean
    isGettingData: boolean
  }
}

export const Months: React.FC<Months.Props> = memo(
  (props) => {
    const graph = useRef<HTMLDivElement>(null)
    const { swiping: isSwiping } = useSwipe(undefined, {
      preventDefault: false,
      passive: false,
      threshold: 0,
    })
    const [key, setKey] = useState('')
    const [startIndex, setStartIndex] = useState<number | null>(null)
    const [endIndex, setEndIndex] = useState<number | null>(null)
    const [draggedStartIndex, setDraggedStartIndex] = useState<number | null>(
      null,
    )
    const [draggedEndIndex, setDraggedEndIndex] = useState<number | null>(null)
    const [bookmarkCount, setBookmarkCount] = useState<number | null>(null)
    const [starredCount, setStarredCount] = useState<number | null>(null)
    const [nsfwCount, setNsfwCount] = useState<number | null>(null)

    useUpdateEffect(() => {
      if (
        !isSwiping &&
        props.months &&
        draggedStartIndex != undefined &&
        draggedEndIndex != undefined &&
        props.months[draggedStartIndex] &&
        props.months[draggedEndIndex]
      ) {
        props.onYyyymmChange({
          gte: props.months[draggedStartIndex].yyyymm,
          lte: props.months[draggedEndIndex].yyyymm,
        })

        setDraggedStartIndex(null)
        setDraggedEndIndex(null)
      }
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
    }): number | null => {
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
          : null

      return startIndex != -1 ? startIndex : null
    }

    const possibleEndIndex = ({
      months,
      currentLte,
    }: {
      months: Months
      currentLte: number
    }): number | null => {
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
          : null

      return endIndex != -1 ? endIndex : null
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

    const calculateCountsThrottled = useThrottledCallback(
      calculateCounts,
      [],
      50,
    )

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
        startIndex: startIndex != null ? startIndex : undefined,
        endIndex: endIndex != null ? endIndex : undefined,
      })

      if (!isSwiping) {
        setKey(
          `${startIndex || ''}${endIndex || ''}${props.selectedTags || ''}`,
        )
      }
    }, [startIndex, endIndex, props.months])

    useEffect(() => {
      if (!props.months || !props.currentGte || !props.currentLte) {
        setKey(
          `${startIndex || ''}${endIndex || ''}${props.selectedTags || ''}`,
        )
        setStartIndex(null)
        setEndIndex(null)

        return
      }

      setStartAndEndIndex({
        months: props.months,
        currentGte: props.currentGte,
        currentLte: props.currentLte,
      })
    }, [props.currentGte, props.currentLte, props.months, props.selectedTags])

    useUpdateEffect(() => {
      if (props.hasResults == undefined) {
        setBookmarkCount(null)
      }
    }, [props.hasResults])

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
      <div className={styles.graph} ref={graph}>
        {props.months && (
          <div className={styles.graph__details}>
            <div className={styles.graph__details__title}>Date range</div>
            <div className={styles['graph__details__current-range']}>
              {props.months.length > 0
                ? startIndex != undefined &&
                  props.months[startIndex] &&
                  endIndex != undefined &&
                  props.months[endIndex]
                  ? _yyyymmToDisplay(props.months[startIndex].yyyymm) +
                    (endIndex != startIndex
                      ? ` - ${_yyyymmToDisplay(props.months[endIndex].yyyymm)}`
                      : '')
                  : 'All history'
                : props.currentGte && props.currentLte
                ? `${_yyyymmToDisplay(props.currentGte)} - ${_yyyymmToDisplay(
                    props.currentLte,
                  )}`
                : 'All history'}
            </div>
            {props.hasResults && bookmarkCount && bookmarkCount > 0 ? (
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
            ) : (
              ''
            )}
          </div>
        )}

        {props.currentGte && props.currentLte && (
          <button
            className={styles.graph__clear}
            onClick={props.clearDateRange}
          >
            <Icon variant="ADD" />
          </button>
        )}

        {!props.isGettingData && props.months && props.months.length >= 2 && (
          <div className={styles.graph__recharts}>
            <ResponsiveContainer width={'100%'} height={135} key={key}>
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
                <YAxis tickCount={1} width={0} />
                <Brush
                  startIndex={startIndex != null ? startIndex : undefined}
                  endIndex={endIndex != null ? endIndex : undefined}
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
                  className={styles.graph__recharts__brush}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {props.hasResults && props.months && props.months.length <= 1 && (
          <div className={styles.graph__info}>All results fit in one month</div>
        )}

        {props.hasResults == false && (
          <div className={styles.graph__info}>There is nothing to plot</div>
        )}
      </div>
    )
  },
  (o, n) =>
    o.isGettingData == n.isGettingData &&
    o.clearDateRange == n.clearDateRange &&
    JSON.stringify(o.months) == JSON.stringify(n.months),
)

function _yyyymmToDisplay(yyyymm: number) {
  return dayjs(
    new Date(
      parseInt(yyyymm.toString().substring(0, 4)),
      parseInt(yyyymm.toString().substring(4, 6)) - 1,
    ),
  ).format('MMM YYYY')
}
