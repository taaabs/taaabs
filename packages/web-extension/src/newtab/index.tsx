import { render } from 'preact'
import { Home } from './app'

import '../../../web-ui/src/styles/style.scss'

const NewTabPage: preact.FunctionComponent = () => {
  return <Home />
}

render(<NewTabPage />, document.getElementById('root')!)
