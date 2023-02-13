import { render, screen } from '@testing-library/react'
import { UiAtoWrapper, UiAtoWrapperTestId } from './UiAtoWrapper'

describe('UiAtoWrapper', () => {
  it('renders children', () => {
    render(<UiAtoWrapper><div>test</div></UiAtoWrapper>)
    const element = screen.getByTestId(UiAtoWrapperTestId.Container)
    expect(element).toContainHTML('<div>test</div>')
  })
})
