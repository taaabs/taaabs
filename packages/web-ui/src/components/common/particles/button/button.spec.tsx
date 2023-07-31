import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

const label = 'Test'

describe('Atoms/Button', () => {
  it('renders children', () => {
    render(<Button href="/test">{label}</Button>)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('has given href attribute', () => {
    const href = '/test'
    render(<Button href={href}>{label}</Button>)
    expect(screen.getByText(label)).toHaveAttribute('href', href)
  })

  it('is disabled if neither href nor onClick are provided', () => {
    render(<Button>{label}</Button>)
    expect(screen.getByText(label)).toBeDisabled()
  })

  it('is of type "button" when onClick is provided', () => {
    render(<Button onClick={() => {}}>{label}</Button>)
    expect(screen.getByText(label).tagName.toLowerCase()).toEqual('button')
  })

  it('is of type "a" when href is provided', () => {
    render(<Button href="">{label}</Button>)
    expect(screen.getByText(label).tagName.toLowerCase()).toEqual('a')
  })

  it('is of type "a" when href and onClick are provided', () => {
    render(
      <Button href="" onClick={() => {}}>
        {label}
      </Button>,
    )
    expect(screen.getByText(label).tagName.toLowerCase()).toEqual('a')
  })

  it('forwards type="submit" prop', () => {
    render(<Button type="submit">{label}</Button>)
    expect(screen.getByText(label)).toHaveAttribute('type', 'submit')
  })

  it('calls "onClick" on click without href', async () => {
    const onClickMock = jest.fn()
    render(<Button onClick={onClickMock}>{label}</Button>)
    const button = screen.getByText(label)
    await userEvent.click(button)
    expect(onClickMock).toHaveBeenCalled()
  })

  it('calls "onClick" on click with href', async () => {
    const onClickMock = jest.fn()
    render(
      <Button onClick={onClickMock} href="/">
        {label}
      </Button>,
    )
    const button = screen.getByText(label)
    await userEvent.click(button)
    expect(onClickMock).toHaveBeenCalled()
  })
})
