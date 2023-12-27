import { Helpers } from '@web-ui'
import { PricingTiers } from './pricing-tiers'

export default {
  component: PricingTiers,
}

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
      <PricingTiers slot_left_side={<div>left</div>} slot_right_side={<div>right</div>} />
    </Helpers.Storybook.StorybookMargin>
  )
}
