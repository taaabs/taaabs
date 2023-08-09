import { StorybookMargin } from '@web-ui/helpers/storybook/storybook-margin'
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
          priceInfo="Lorem ipsum"
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
