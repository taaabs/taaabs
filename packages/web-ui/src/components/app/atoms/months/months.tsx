import { Area, AreaChart, Brush, ResponsiveContainer } from 'recharts'
import styles from './months.module.scss'
import useDebouncedCallback from 'beautiful-react-hooks/useDebouncedCallback'

export namespace Months {
  export type Props = {
    months: {
      yyyymm: number
      bookmarkCount: number
      starredCount: number
      nsfwCount: number
    }[]
    initYyyymmGte?: number
    initYyyymmLte?: number
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
      <ResponsiveContainer width={'100%'} height={160}>
        <AreaChart margin={{ left: 0 }} data={props.months}>
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
            strokeWidth={1}
            stroke="var(--Months-chart-nsfw-stroke)"
            fill="transparent"
            animationDuration={0}
          />
          <Brush
            startIndex={
              props.initYyyymmGte
                ? props.months.findIndex(
                    (month) => month.yyyymm == props.initYyyymmGte,
                  )
                : undefined
            }
            endIndex={
              props.initYyyymmLte
                ? props.months.findIndex(
                    (month) => month.yyyymm == props.initYyyymmLte,
                  )
                : undefined
            }
            height={24}
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
    </div>
  )
}
