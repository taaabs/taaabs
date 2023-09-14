import { render, screen } from '@testing-library/react'
import { ButtonAvatar } from './button-avatar'
import userEvent from '@testing-library/user-event'

const testId = 'test'

describe('Atoms/ButtonAvatar', () => {
  it('calls provided on click function when clicked', async () => {
    const onClickMock = jest.fn()
    render(
      <ButtonAvatar
        url=""
        blurhash=""
        alt=""
        on_click={onClickMock}
        test_id={testId}
      />,
    )
    const el = screen.getByTestId(testId)
    await userEvent.click(el)
    expect(onClickMock).toHaveBeenCalled()
  })

  it('has img with provided url and alt text', () => {
    const altText = 'test'
    const url = 'test.img'
    render(
      <ButtonAvatar url={url} blurhash="" alt={altText} on_click={() => {}} />,
    )
    const el = screen.getByAltText(altText)
    expect(el).toHaveAttribute('src', url)
    expect(el.tagName.toLocaleLowerCase()).toEqual('img')
  })
})
