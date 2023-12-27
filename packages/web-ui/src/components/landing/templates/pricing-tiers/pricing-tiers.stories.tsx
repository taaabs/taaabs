import { StorybookMargin } from '@web-ui/helpers/storybook'
import { PricingTiers } from './pricing-tiers'

export default {
  component: PricingTiers,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <PricingTiers
        slot_left_side={<div>left</div>}
        slot_right_side={<div>right</div>}
      />
    </StorybookMargin>
  )
}
