import { useState } from 'react'
import { portfolio } from '../profile.js'
import './App.css'

function localProfileAnswer(question) {
  const text = question.toLowerCase()

  if (/^(hi|hello|hey|namaste|good morning|good evening|good afternoon|yo)\b/.test(text) || /\b(hi|hello|hey|namaste)\b/.test(text)) {
    return `Hi! I’m Dixit’s portfolio assistant. I can tell you about his name, skills, education, projects, and contact details.`
  }

  if (/(who are you|what can you do|what do you know|what you know|tell me about yourself|what are you)/.test(text)) {
    return `I know about Dixit’s portfolio, including his name, education, skills, projects, and contact details.`
  }

  if (/(your name|name\??|give name|who is this|who are you\??)/.test(text) || /\bname\b/.test(text)) {
    return `Dixit.`
  }

  if (/(10(th)?|class 10|tenth)/.test(text) && /(12(th)?|class 12|twelfth)/.test(text)) {
    return `Dixit's marks are: Class 10 — ${portfolio.education[2].result}; Class 12 — ${portfolio.education[1].result}. Current university CGPA: ${portfolio.education[0].result}.`
  }
  if (/10(th)?|class 10|tenth/.test(text)) return `Dixit scored ${portfolio.education[2].result} in Class 10.`
  if (/12(th)?|class 12|twelfth/.test(text)) return `Dixit scored ${portfolio.education[1].result} in Class 12.`
  if (/cgpa|college marks|university marks/.test(text)) return `Dixit's current CGPA is ${portfolio.education[0].result}.`
  if (/marks?|scores?|percentages?|results?/.test(text)) {
    return `Dixit's marks are: Class 10 — ${portfolio.education[2].result}; Class 12 — ${portfolio.education[1].result}. Current university CGPA: ${portfolio.education[0].result}.`
  }
  if (/skill|technology|programming/.test(text)) {
    return `Dixit's skills include ${portfolio.skills.programming.join(', ')}, ${portfolio.skills.frontend.join(', ')}, and ${portfolio.skills.tools.join(', ')}.`
  }
  if (/project|passport|otp/.test(text)) {
    const project = portfolio.projects[0]
    return `${project.name} is an ${project.type.toLowerCase()} using ${project.technologies.join(', ')}. It is ${project.status.toLowerCase()}.`
  }
  if (/age|old/.test(text)) return `Dixit is ${portfolio.age} years old.`
  if (/(location|where are you from|from where|city|state|country)/.test(text)) return `Dixit is from ${portfolio.location}.`
  if (/(mail|email|contact|reach|call)/.test(text)) return `You can contact Dixit at ${portfolio.contact.email}.`
  return 'I know about Dixit’s name, skills, education, projects, and contact details.'
}

function isMarksQuestion(question) {
  return /\bmarks?\b|\bscores?\b|\bpercentages?\b|\bresults?\b|\bcgpa\b/i.test(question)
}

function PortfolioChat() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [pending, setPending] = useState(false)

  async function sendQuestion(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || pending) return
    const conversation = [...messages, { role: 'user', content: text }]
    setMessages(conversation)
    setQuestion('')
    setPending(true)
    try {
      if (isMarksQuestion(text)) {
        setMessages((current) => [...current, { role: 'assistant', content: localProfileAnswer(text) }])
        return
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'portfolio', messages: conversation.slice(-12) }),
      })
      const body = await response.text()
      let result
      try {
        result = body ? JSON.parse(body) : null
      } catch {
        throw new Error(`Chat API returned an invalid response (HTTP ${response.status}). Check that the deployment includes the /api/chat endpoint.`)
      }
      if (!result || typeof result !== 'object') {
        throw new Error(`Chat API returned an empty response (HTTP ${response.status}). Check that the deployment includes the /api/chat endpoint.`)
      }
      if (!response.ok) throw new Error(result.error || 'Could not get a reply.')
      const reply = result.mode === 'demo' ? localProfileAnswer(text) : result.reply
      if (typeof reply !== 'string' || !reply.trim()) {
        throw new Error('Chat API returned no reply. Check the API server and AI provider configuration.')
      }
      setMessages((current) => [...current, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: `Sorry, I couldn’t reply: ${error.message}` }])
    } finally {
      setPending(false)
    }
  }

  return (
    <aside className="portfolio-chat">
      {open && (
        <section className="portfolio-chat-panel" aria-label="Portfolio chatbot">
          <header><span><b>✳</b><span><strong>Ask about Dixit</strong><small>Portfolio assistant</small></span></span><button type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
          <div className="portfolio-chat-messages" aria-live="polite">
            {messages.length === 0 && <p className="portfolio-chat-welcome">Hi! Ask me about Dixit’s profile or any general question.</p>}
            {messages.map((message, index) => (
              <article className={`portfolio-chat-message ${message.role}`} key={`${index}-${message.role}`}>
                <b>{message.role === 'user' ? 'You' : 'Dixit’s assistant'}</b><p>{message.content}</p>
              </article>
            ))}
            {pending && <p className="portfolio-chat-thinking">Thinking…</p>}
          </div>
          <form onSubmit={sendQuestion}>
            <input aria-label="Ask about Dixit" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question…" />
            <button type="submit" disabled={!question.trim() || pending} aria-label="Send">↑</button>
          </form>
        </section>
      )}
      <button className="portfolio-chat-launcher" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close chat' : '✳ Ask my AI'}
      </button>
    </aside>
  )
}

export default function App() {
  return (
    <main className="portfolio-home">
      <header className="site-header">
        <a className="site-brand" href="#home"><span className="site-brand-mark">D</span><span>Dixit<span className="brand-dot">.</span></span></a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about">About</a><a href="#skills">Skills</a><a href="#education">Education</a><a href="#projects">Projects</a>
        </nav>
        <a className="header-contact" href={`mailto:${portfolio.contact.email}`}>Get in touch</a>
      </header>

      <section className="home-hero page-width" id="home">
        <div>
          <span className="home-eyebrow">HELLO, I’M</span>
          <h1>{portfolio.name}<span>.</span></h1>
          <h2>{portfolio.role}</h2>
          <p className="home-headline">{portfolio.headline}</p>
          <p className="home-about">{portfolio.about}</p>
          <div className="home-actions"><a className="primary-link" href="#projects">Explore my work ↗</a><a className="secondary-link" href={`mailto:${portfolio.contact.email}`}>Contact me</a></div>
          <p className="home-location">{portfolio.location}</p>
        </div>
        <aside className="home-profile-card">
          <span className="profile-star">✳</span><small>A LITTLE ABOUT ME</small>
          <p>“Curious by nature.<br /><em>Building with purpose.</em>”</p>
          <div><b>{portfolio.age}</b><span>years young</span><b>{portfolio.education[0].result}</b><span>current CGPA</span></div>
        </aside>
      </section>

      <section className="home-section page-width" id="about">
        <div><span className="section-kicker">01 / ABOUT ME</span><h2>Curiosity is where<br /><em>everything starts.</em></h2></div>
        <p>{portfolio.about}<br /><br />{portfolio.objective}</p>
      </section>
      <section className="home-section page-width" id="skills">
        <div><span className="section-kicker">02 / MY TOOLKIT</span><h2>Things I work<br /><em>and learn with.</em></h2></div>
        <div className="home-skill-groups">
          {Object.entries(portfolio.skills).map(([group, skills]) => <article key={group}><h3>{group === 'learning' ? 'Currently learning' : group}</h3><div>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}
          <article><h3>Data Structures & Algorithms</h3><div>{portfolio.dsa.map((skill) => <span key={skill}>{skill}</span>)}</div></article>
        </div>
      </section>
      <section className="home-section education-section page-width" id="education">
        <div><span className="section-kicker">03 / EDUCATION</span><h2>Always learning.<br /><em>Always growing.</em></h2></div>
        <div className="education-items">{portfolio.education.map((item) => <article key={item.degree}><div><strong>{item.degree}{item.field ? ` — ${item.field}` : ''}</strong><span>{item.school} {item.year ? `· ${item.year}` : ''}</span></div><b>{item.result}</b></article>)}</div>
      </section>
      <section className="home-section page-width" id="projects">
        <div><span className="section-kicker">04 / PROJECTS</span><h2>Learning by<br /><em>making things.</em></h2></div>
        <div className="project-preview">{portfolio.projects.map((project) => <article key={project.name}><small>{project.status}</small><h3>{project.name}</h3><b>{project.type}</b><p>{project.description}</p><div>{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></article>)}</div>
      </section>
      <section className="home-contact"><div className="page-width"><span className="section-kicker">HAVE A QUESTION?</span><h2>Let’s make something<br /><em>meaningful.</em></h2><a href={`mailto:${portfolio.contact.email}`}>{portfolio.contact.email}</a></div></section>
      <footer className="site-footer page-width"><a className="site-brand" href="#home"><span className="site-brand-mark">D</span><span>Dixit.</span></a><span>Designed with curiosity in Samana, Punjab.</span><a href="/PORTFOLIO-CHATBOT.txt">How the chatbot works</a></footer>
      <PortfolioChat />
    </main>
  )
}
