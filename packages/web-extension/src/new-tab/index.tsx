import ReactDOM from 'react-dom'
import { Home } from './routes/home/home'

import '../../../web-ui/src/styles/style.scss'

const NewTabPage: React.FC = () => {
  return <Home />
}

ReactDOM.render(<NewTabPage />, document.body)
