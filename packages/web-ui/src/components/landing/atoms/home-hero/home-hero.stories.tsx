import { HomeHero } from './home-hero'

export default {
  component: HomeHero,
}

export const Primary = () => (
  <HomeHero
    heading="Lorem ipsum"
    subheading={
      <>
        <p>Lorem ipsum</p>
        <p>Lorem ipsum</p>
      </>
    }
  />
)
