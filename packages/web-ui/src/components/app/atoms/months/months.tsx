import { Area, AreaChart, Brush, ResponsiveContainer } from 'recharts'
import styles from './months.module.scss'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'

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
    currentYyyymmGte?: number
    currentYyyymmLte?: number
    onYymmChange: ({
      yyyymmGte,
      yyyymmLte,
    }: {
      yyyymmGte: number
      yyyymmLte: number
    }) => void
  }
}

export const Months: React.FC<Months.Props> = (props) => {
  const onBrushDrag = useDebouncedCallback(
    ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
      if (!props.months) throw 'Months should be set.'

      props.onYymmChange({
        yyyymmGte: props.months[startIndex].yyyymm,
        yyyymmLte: props.months[endIndex].yyyymm,
      })
    },
    [props.onYymmChange],
    200,
  )

  return (
    <div className={styles.graph}>
      {props.months && props.months.length >= 2 && (
        <ResponsiveContainer width={'100%'} height={160}>
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
            />
            <Brush
              startIndex={
                props.currentYyyymmGte
                  ? props.months.find(
                      (month) => month.yyyymm == props.currentYyyymmGte,
                    )
                    ? props.months.findIndex(
                        (month) => month.yyyymm == props.currentYyyymmGte,
                      )
                    : props.months.findIndex(
                        (month) =>
                          month.yyyymm ==
                          Math.min(...props.months!.map((m) => m.yyyymm)),
                      )
                  : undefined
              }
              endIndex={
                props.currentYyyymmLte
                  ? props.months.find(
                      (month) => month.yyyymm == props.currentYyyymmLte,
                    )
                    ? props.months.findIndex(
                        (month) => month.yyyymm == props.currentYyyymmLte,
                      )
                    : props.months.findIndex(
                        (month) =>
                          month.yyyymm ==
                          Math.max(...props.months!.map((m) => m.yyyymm)),
                      )
                  : undefined
              }
              height={40}
              travellerWidth={32}
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
          Nothing to plot here...
        </div>
      )}
    </div>
  )
}
