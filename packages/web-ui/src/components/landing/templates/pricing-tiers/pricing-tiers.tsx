import { Wrapper } from '@web-ui/components/common/particles/wrapper'
import styles from './pricing-tiers.module.scss'

export namespace PricingTiers {
  export type Props = {
    leftSlot: React.ReactNode
    rightSlot: React.ReactNode
  }
}

export const PricingTiers: React.FC<PricingTiers.Props> = (props) => {
  return (
    <section className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>
          {props.leftSlot}
          {props.rightSlot}
        </div>
      </Wrapper>
    </section>
  )
}
