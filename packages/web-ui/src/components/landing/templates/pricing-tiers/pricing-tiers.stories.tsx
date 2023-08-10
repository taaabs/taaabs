import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
import { PricingTiers } from './pricing-tiers'

export default {
  component: PricingTiers,
}

export const Primary = () => {
  return (
    <StorybookMargin>
      <PricingTiers leftSlot={<div>left</div>} rightSlot={<div>right</div>} />
    </StorybookMargin>
  )
}
