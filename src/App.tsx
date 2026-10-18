import './App.css'
import Backdrop from './components/Backdrop'
import CursorGlow from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import { EMAIL, GITHUB_URL } from './data'

function App() {
  return (
    <div className="shell">
      <Backdrop />
      <CursorGlow />
      <Nav />

      <main>
        <Hero />
      </main>

      <footer className="footer">
        <span className="footer-line">
          <span aria-hidden="true">$</span> echo &quot;keep building. stay curious.&quot;
        </span>
        <span className="footer-links">
          <a href={`mailto:${EMAIL}`}>email</a>
          <span aria-hidden="true">·</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            github
          </a>
        </span>
      </footer>
    </div>
  )
}

export default App
