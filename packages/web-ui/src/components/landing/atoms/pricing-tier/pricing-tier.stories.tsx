import { Helpers } from '@web-ui'
import { PricingTier } from './pricing-tier'

export default { component: PricingTier }

export const Primary = () => {
  return (
    <Helpers.Storybook.StorybookMargin>
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
    </Helpers.Storybook.StorybookMargin>
  )
}
