import { Area, AreaChart, Brush, ResponsiveContainer } from 'recharts'
import styles from './months.module.scss'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import useThrottledCallback from 'beautiful-react-hooks/useThrottledCallback'
import { useEffect, useState } from 'react'
import { useIsHydrated } from '@shared/hooks'

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
  const [key, setKey] = useState('')
  const [startIndex, setStartIndex] = useState<number | undefined>(undefined)
  const [endIndex, setEndIndex] = useState<number | undefined>(undefined)
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null)
  const [starredCount, setStarredCount] = useState<number | null>(null)
  const [nsfwCount, setNsfwCount] = useState<number | null>(null)

  const onBrushDrag = useDebouncedCallback(
    ({
      months,
      startIndex,
      endIndex,
    }: {
      months: Months
      startIndex: number
      endIndex: number
    }) => {
      props.onYyyymmChange({
        gte: months[startIndex].yyyymm,
        lte: months[endIndex].yyyymm,
      })
    },
    [props.onYyyymmChange],
    200,
  )

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

  const calculateCountsThrottled = useThrottledCallback(calculateCounts, [], 50)

  useEffect(() => {
    calculateCounts({ months: props.months, startIndex, endIndex })
    setKey(`${startIndex || ''}${endIndex || ''}${props.selectedTags || ''}`)
  }, [startIndex, endIndex, props.selectedTags, props.months])

  useEffect(() => {
    setStartIndex(
      props.months && props.currentGte
        ? props.months.find((month) => month.yyyymm == props.currentGte)
          ? props.months.findIndex((month) => month.yyyymm == props.currentGte)
          : props.months.findIndex((month) => {
              const monthsFiltered = props.months!.filter(
                (m) => m.yyyymm > props.currentGte!,
              )
              return monthsFiltered.length
                ? month.yyyymm ==
                    monthsFiltered
                      .map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - props.currentGte!) <
                        Math.abs(prev - props.currentGte!)
                          ? curr
                          : prev,
                      )
                : month.yyyymm ==
                    props
                      .months!.map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - props.currentGte!) <
                        Math.abs(prev - props.currentGte!)
                          ? curr
                          : prev,
                      )
            })
        : undefined,
    )

    setEndIndex(
      props.months && props.currentLte
        ? props.months.find((month) => month.yyyymm == props.currentLte)
          ? props.months.findIndex((month) => month.yyyymm == props.currentLte)
          : props.months.findIndex((month) => {
              const monthsFiltered = props.months!.filter(
                (m) => m.yyyymm < props.currentLte!,
              )
              return monthsFiltered.length
                ? month.yyyymm ==
                    monthsFiltered
                      .map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - props.currentLte!) <
                        Math.abs(prev - props.currentLte!)
                          ? curr
                          : prev,
                      )
                : month.yyyymm ==
                    props
                      .months!.map((m) => m.yyyymm)
                      .reduce((prev, curr) =>
                        Math.abs(curr - props.currentLte!) <
                        Math.abs(prev - props.currentLte!)
                          ? curr
                          : prev,
                      )
            })
        : undefined,
    )
  }, [props.currentGte, props.currentLte, props.months])

  return (
    <div className={styles.graph}>
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

                calculateCountsThrottled({
                  months: props.months,
                  startIndex,
                  endIndex,
                })
                onBrushDrag({ months: props.months, startIndex, endIndex })
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
