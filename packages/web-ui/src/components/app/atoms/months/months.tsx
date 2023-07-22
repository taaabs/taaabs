import { Area, AreaChart, Brush, ResponsiveContainer } from 'recharts'
import styles from './months.module.scss'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'
import { useEffect, useState } from 'react'

export namespace Months {
  export type Props = {
    months:
      | {
          yyyymm: number
          bookmarkCount: number
          starredCount: number
          nsfwCount: number
        }[]
      | null
    currentGte?: number
    currentLte?: number
    onYyyymmChange: ({ gte, lte }: { gte: number; lte: number }) => void
    selectedTags?: string
  }
}

export const Months: React.FC<Months.Props> = (props) => {
  const [key, setKey] = useState('')
  const [draggedGte, setDraggedGte] = useState<number | null>(null)
  const [draggedLte, setDraggedLte] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string | null>(null)

  const onBrushDrag = useDebouncedCallback(
    ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
      if (!props.months || !props.months[startIndex] || !props.months[endIndex])
        return

      setDraggedGte(props.months[startIndex].yyyymm)
      setDraggedLte(props.months[endIndex].yyyymm)

      props.onYyyymmChange({
        gte: props.months[startIndex].yyyymm,
        lte: props.months[endIndex].yyyymm,
      })
    },
    [props.onYyyymmChange],
    200,
  )

  useEffect(() => {
    if (
      props.currentGte != draggedGte ||
      props.currentLte != draggedLte ||
      props.selectedTags != selectedTags
    ) {
      setSelectedTags(props.selectedTags || null)
      setKey(
        `${props.currentGte}${props.currentLte}${props.selectedTags || ''}`,
      )
    }
  }, [props.currentGte, props.currentLte, props.selectedTags])

  return (
    <div className={styles.graph}>
      {props.months && props.months.length >= 2 && (
        <ResponsiveContainer width={'100%'} height={160} key={key}>
          <AreaChart margin={{ left: 0, top: 5 }} data={props.months}>
            <Area
              type="basis"
              dataKey="bookmarkCount"
              strokeWidth={0}
              fill="var(--Months-chart-fill)"
              fillOpacity={1}
              animationDuration={0}
            />
            <Area
              type="basis"
              dataKey="starredCount"
              strokeWidth={0}
              fill="var(--Months-chart-starred-fill)"
              fillOpacity={1}
              animationDuration={0}
            />
            <Area
              type="basis"
              dataKey="bookmarkCount"
              strokeWidth={2}
              stroke="var(--Months-chart-stroke)"
              fill="transparent"
              animationDuration={0}
            />
            <Area
              type="basis"
              dataKey="nsfwCount"
              strokeWidth={2}
              stroke="var(--Months-chart-nsfw-stroke)"
              fill="transparent"
              animationDuration={0}
              strokeOpacity={1}
            />
            <Brush
              startIndex={
                props.months && props.currentGte
                  ? props.months.find(
                      (month) => month.yyyymm == props.currentGte,
                    )
                    ? props.months.findIndex(
                        (month) => month.yyyymm == props.currentGte,
                      )
                    : props.months.findIndex(
                        (month) =>
                          month.yyyymm ==
                          props
                            .months!.map((m) => m.yyyymm)
                            .reduce((prev, curr) =>
                              Math.abs(curr - props.currentGte!) <
                              Math.abs(prev - props.currentGte!)
                                ? curr
                                : prev,
                            ),
                      )
                  : undefined
              }
              endIndex={
                props.months && props.currentLte
                  ? props.months.find(
                      (month) => month.yyyymm == props.currentLte,
                    )
                    ? props.months.findIndex(
                        (month) => month.yyyymm == props.currentLte,
                      )
                    : props.months.findIndex(
                        (month) =>
                          month.yyyymm ==
                          props
                            .months!.map((m) => m.yyyymm)
                            .reduce((prev, curr) =>
                              Math.abs(curr - props.currentLte!) <
                              Math.abs(prev - props.currentLte!)
                                ? curr
                                : prev,
                            ),
                      )
                  : undefined
              }
              height={40}
              travellerWidth={24}
              fill="transparent"
              onChange={({ startIndex, endIndex }) => {
                if (startIndex == undefined || endIndex == undefined) return
                onBrushDrag({ startIndex, endIndex })
              }}
              className={styles.graph__brush}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {props.months && props.months.length == 1 && (
        <div className={styles['graph__too-few-months']}>
          All bookmarks are within one month
        </div>
      )}
      {props.months && props.months.length == 0 && (
        <div className={styles['graph__too-few-months']}>
          There is nothing to plot
        </div>
      )}
    </div>
  )
}
