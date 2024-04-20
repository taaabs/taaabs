import styles from './pricing-tier.module.scss'
import { Icon } from '@web-ui/components/common/particles/icon'
import cn from 'classnames'

export namespace PricingTier {
  export type Props = {
    name: string
    description: string
    price: string
    price_info?: {
      first_line: string
      second_line: string
    }
    bullets_heading: string
    bullets: string[]
    is_featured?: boolean
    slot_button: React.ReactNode
  }
}

export const PricingTier: React.FC<PricingTier.Props> = (props) => {
  return (
    <div
      className={cn(styles.container, {
        [styles['container--featured']]: props.is_featured,
      })}
    >
      <div className={styles.top}>
        <div className={styles.top__name}>{props.name}</div>
        <div className={styles.top__description}>{props.description}</div>
      </div>
      <div className={styles.price}>
        <div className={styles.price__cost}>{props.price}</div>
        {props.price_info && (
          <div className={styles.price__info}>
            <span>{props.price_info.first_line}</span>
            <span>{props.price_info.second_line}</span>
          </div>
        )}
      </div>
      <div className={styles.bullets}>
        <h4 className={styles.bullets__heading}>{props.bullets_heading}</h4>
        <div className={styles.bullets__inner}>
          {props.bullets.map((bullet, i) => (
            <div className={styles.bullets__inner__item} key={i}>
              <div className={styles.bullets__inner__item__check}>
                <Icon variant="SELECTED_BOLD" />
              </div>
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.button}>{props.slot_button}</div>
    </div>
  )
}
