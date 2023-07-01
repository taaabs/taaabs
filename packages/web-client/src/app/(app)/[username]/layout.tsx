import store from '@repositories/stores/other-user/other-user.store'
import { Provider } from 'react-redux'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default Layout