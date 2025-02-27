import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders button of type "submit"', () => {
    render(<Button type="submit">Test</Button>)
    const button = screen.getByRole('button', { name: 'Test' })
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('renders a link when href is provided', () => {
    render(<Button href="/test">Test</Button>)
    const link = screen.getByRole('link', { name: 'Test' })
    expect(link).toHaveAttribute('href', '/test')
  })

  it('calls provided on_click function', () => {
    const mockClick = jest.fn()
    render(<Button on_click={mockClick}>Test</Button>)
    const button = screen.getByRole('button', { name: 'Test' })
    fireEvent.click(button)
    expect(mockClick).toHaveBeenCalledTimes(1)
  })

  it('renders a disabled button when no href or on_click is provided', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button', { name: 'Test' })
    expect(button).toBeDisabled()
  })

  it('sets autoFocus when auto_focus is true', () => {
    render(
      <Button auto_focus={true} on_click={() => {}}>
        Lorem ipsum
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveFocus()
  })

  it('renders children correctly', () => {
    render(<Button>Test</Button>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
