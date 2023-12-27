import { StorybookMargin } from '@web-ui/helpers/storybook'
import { PricingTier } from './pricing-tier'

export default { component: PricingTier }

export const Primary = () => {
  return (
    <StorybookMargin>
      <div style={{ width: 520 }}>
        <PricingTier
          name="Lorem"
          description="Lorem ipsum"
          price="$0"
          price_duration="Month"
          price_info="Lorem ipsum"
          bullets={[
            'Lorem ipsum',
            'Lorem ipsum',
            'Lorem ipsum',
            'Lorem ipsum',
            'Lorem ipsum',
          ]}
        />
      </div>
    </StorybookMargin>
  )
}
