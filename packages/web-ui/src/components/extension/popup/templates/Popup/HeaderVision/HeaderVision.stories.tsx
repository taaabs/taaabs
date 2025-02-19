import { HeaderVision } from './HeaderVision'

export default {
  component: HeaderVision,
}

export const Primary = () => {
  return (
    <div style={{ width: '300px', margin: '50px' }}>
      <HeaderVision
        back_button_on_click={() => {}}
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
        on_resize={() => {}}
        translations={{
          title: 'Vision',
          restore: 'Restore',
          loading: 'Loading...',
        }}
      />
    </div>
  )
}
