import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import styles from './pricing-tiers.module.scss'

export namespace PricingTiers {
  export type Props = {
    slot_left_side: React.ReactNode
    slot_right_side: React.ReactNode
  }
}

export const PricingTiers: React.FC<PricingTiers.Props> = (props) => {
  return (
    <section className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          {props.slot_left_side}
          {props.slot_right_side}
        </div>
      </Wrapper>
    </section>
  )
}
