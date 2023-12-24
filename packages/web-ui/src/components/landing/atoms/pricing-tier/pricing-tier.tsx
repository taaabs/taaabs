import { Icon } from '@web-ui/components/common/particles/icon'
import styles from './pricing-tier.module.scss'

export namespace PricingTier {
  export type Props = {
    name: string
    description: string
    price: string
    price_duration?: string
    price_info: string
    bullets: string[]
  }
}

export const PricingTier: React.FC<PricingTier.Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.top__name}>{props.name}</div>
        <div className={styles.top__description}>{props.description}</div>
      </div>
      <div className={styles.price}>
        <div className={styles.price__cost}>
          <div>{props.price}</div>
          {props.price_duration ? (
            <div>/ {props.price_duration}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className={styles.price__info}>{props.price_info}</div>
      </div>
      <div className={styles.bullets}>
        {props.bullets.map((bullet) => (
          <div className={styles.bullets__item}>
            <div className={styles.bullets__item__check}>
              <Icon variant="SELECTED_BOLD" />
            </div>
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
