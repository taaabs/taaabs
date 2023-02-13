import { render, screen } from '@testing-library/react'
import { UiLayoutLanding, UiLayoutLandingProps, UiLayoutLandingTestId } from './UiLayoutLanding'

describe('UiLayoutLanding', () => {
  const props: UiLayoutLandingProps = {
    logIn: { label: 'Log in', onClick: () => {} },
    getStarted: { label: 'Get started', onClick: () => {} },
  }
  it('renders children', () => {
    render(
      <UiLayoutLanding {...props}>
        <div>test</div>
      </UiLayoutLanding>
    )
    const element = screen.getByTestId(UiLayoutLandingTestId.Main)
    expect(element).toContainHTML('<div>test</div>')
  })
})
