import { render, screen } from '@testing-library/react'
import { UiAtoWrapper, UiAtoWrapperTestId } from './UiAtoWrapper'

describe('UiAtoWrapper', () => {
  it('renders children', () => {
    const children = <div>test</div>
    render(<UiAtoWrapper>{children}</UiAtoWrapper>)
    const element = screen.getByTestId(UiAtoWrapperTestId.Container)
    expect(element).toContainHTML('<div>test</div>')
  })
})
