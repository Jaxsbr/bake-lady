import { render } from 'preact'
import { App } from './components/App'
import './styles/base.css'
import './styles/components.css'

const root = document.getElementById('app')
if (root) {
  render(<App />, root)
}
