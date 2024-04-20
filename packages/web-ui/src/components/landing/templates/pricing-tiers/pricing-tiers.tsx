import styles from './pricing-tiers.module.scss'
import { Wrapper } from '@web-ui/components/common/templates/wrapper'

export namespace PricingTiers {
  export type Props = {
    children: React.ReactNode
  }
}

export const PricingTiers: React.FC<PricingTiers.Props> = (props) => {
  return (
    <section className={styles.container}>
      <Wrapper>
        <div className={styles.inner}>{props.children}</div>
      </Wrapper>
    </section>
  )
}
