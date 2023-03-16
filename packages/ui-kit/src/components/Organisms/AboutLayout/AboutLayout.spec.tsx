import { fireEvent, render, screen } from '@testing-library/react'
import { AboutLayout, AboutLayoutProps } from './AboutLayout'

const exampleProps: AboutLayoutProps = {
  logIn: { label: 'Log in', onClick: () => {} },
  getStarted: { label: 'Get started', onClick: () => {} },
}

describe('Layouts/Landing', () => {
  it('renders children', () => {
    const text = 'Test content'

    render(<AboutLayout {...exampleProps}>{text}</AboutLayout>)

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders labels', () => {
    const props: AboutLayoutProps = {
      logIn: { label: 'Test label for log in', onClick: () => {} },
      getStarted: { label: 'Test label for get started', onClick: () => {} },
    }

    render(<AboutLayout {...props}></AboutLayout>)

    expect(screen.queryByText(props.logIn.label)).toBeInTheDocument()
    expect(screen.queryByText(props.getStarted.label)).toBeInTheDocument()
  })

  it('calls callbacks when labels are clicked', () => {
    const logInOnClickMock = jest.fn()
    const signUpOnClickMock = jest.fn()
    const props: AboutLayoutProps = {
      logIn: { label: 'Log in', onClick: logInOnClickMock },
      getStarted: { label: 'Get started', onClick: signUpOnClickMock },
    }

    render(<AboutLayout {...props}></AboutLayout>)

    const logInButton = screen.getByText(props.logIn.label)
    const signUpButton = screen.getByText(props.getStarted.label)
    fireEvent.click(logInButton)
    expect(logInOnClickMock).toHaveBeenCalled()
    fireEvent.click(signUpButton)
    expect(signUpOnClickMock).toHaveBeenCalled()
  })
})
