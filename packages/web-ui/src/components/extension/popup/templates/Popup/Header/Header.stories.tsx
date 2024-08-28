import { Header } from './Header'

export default {
  component: Header,
}

export const Primary = () => {
  return (
    <div style={{ width: '300px', margin: '50px' }}>
      <Header settings_url="" />
    </div>
  )
}
