import { DraggableFormInputs } from './draggable-form-inputs'

export default {
  component: DraggableFormInputs,
}

export const Primary = () => (
  <DraggableFormInputs
    items={[
      { value: 'lorem', is_public: true },
      { value: 'ipsum', is_public: false },
    ]}
    on_change={() => {}}
    button_text="Lorem"
  />
)
