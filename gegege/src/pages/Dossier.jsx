import { useEffect, useState } from 'react'
import { PortraitArt } from '../art.jsx'
import { useReveal } from '../lib/useReveal.js'
import { compressImageFile } from '../lib/download.js'
import { useData, useToast } from '../state/contexts.js'

const FACTS = [
  ['Alias', 'The Unwritten'],
  ['Age', 'Unrecorded'],
  ['Origin', 'The White Room'],
  ['Element', 'Tide'],
  ['Status', 'Draft'],
]

const STATS = [
  ['Curiosity', 94],
  ['Composure', 88],
  ['Memory', 12],
  ['Mischief', 61],
]

const NOTES = [
  'She answers to silence before she answers to her name.',
  'Every mirror in the White Room was turned to face the wall.',
  'The tide brings things back. She has learned to wait.',
]

const TRAITS = [
  ['Tidal calm', 'Slow to anger, impossible to hurry, and always, eventually, everywhere.'],
  ['Blank slate', 'No past to inherit, no ending to spoil. Every morning is a first meeting.'],
  ['Ink-stained', 'Feelings leave marks. She hides them in the margins and the blue behind her eyes.'],
  ['Blue hour', 'Most herself between the last light and the first dark.'],
]

export default function Dossier() {
  const { profile, updateProfile } = useData()
  const toast = useToast()
  const [givenName, setGivenName] = useState(() => {
    try {
      return localStorage.getItem('blank:given-name') ?? ''
    } catch {
      return ''
    }
  })
  useReveal()

  useEffect(() => {
    try {
      localStorage.setItem('blank:given-name', givenName)
    } catch {
      /* storage may be unavailable */
    }
  }, [givenName])

  const name = givenName.trim() || 'Blank'
  const replaceDossierImage = async (file) => {
    if (!file) return
    try {
      const image = await compressImageFile(file)
      updateProfile({ dossierImage: image.src })
      toast('Dossier portrait updated on this device', 'success')
    } catch {
      toast('Could not load that image', 'error')
    }
  }

  return (
    <div className="dossier-page">
      <header className="page-heading dossier-heading" data-reveal>
        <p className="kicker"><span>01</span> Subject file · 000</p>
        <h1>The file<br /><em>on Blank.</em></h1>
        <p className="lead">{profile.dossierDescription}</p>
      </header>

      <div className="dossier-page-grid">
        <section className="dossier-profile" data-reveal aria-label="Character profile">
          <div className="dossier-profile-art" data-art-id="dossier-portrait">
            {profile.dossierImage ? <img src={profile.dossierImage} alt="Custom dossier portrait" /> : <PortraitArt />}
          </div>
          <label className="dossier-image-edit mono">
            Change portrait
            <input type="file" accept="image/*" onChange={(event) => replaceDossierImage(event.target.files?.[0])} />
          </label>
          <div className="dossier-profile-bottom">
            <span className="mono">SUBJECT 000 · FILED UNDER UNWRITTEN</span>
            <span className="profile-status"><i /> DRAFT</span>
          </div>
        </section>

        <div className="dossier-detail-column">
          <article className="dossier-info-card" data-reveal>
            <div className="dossier-name-head">
              <span className="dossier-avatar">{name.charAt(0).toUpperCase()}</span>
              <div>
                <p className="mono">full name</p>
                <h2>{name}</h2>
              </div>
            </div>
            <dl className="dossier-facts">
              {(profile.dossierFacts || FACTS).map(([label, value]) => (
                <div key={label}><dt className="mono">{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
            <div className="dossier-name-slot">
              <label className="mono" htmlFor="given-name">What would you call her?</label>
              <div className="slot-input">
                <input
                  id="given-name"
                  value={givenName}
                  onChange={(event) => setGivenName(event.target.value)}
                  maxLength={24}
                  placeholder="Type a name…"
                  autoComplete="off"
                />
                {givenName && <button type="button" className="slot-clear" onClick={() => setGivenName('')}>Clear</button>}
              </div>
              <p>She keeps whatever name you give her — only in this browser.</p>
            </div>
          </article>

          <article className="dossier-info-card dossier-stats-card" data-reveal>
            <p className="panel-title">Traits, measured</p>
            <ul className="stats">
              {STATS.map(([label, value]) => (
                <li className="stat" key={label}>
                  <div className="stat-head"><span>{label}</span><span className="mono">{value}</span></div>
                  <div className="stat-track"><span className="stat-fill" style={{ '--value': `${value}%` }} /></div>
                </li>
              ))}
            </ul>
            <p className="stats-note mono">readings approximate — she is not fond of scales</p>
          </article>
        </div>
      </div>

      <details className="story-edit-panel dossier-edit-panel">
        <summary>Edit her dossier</summary>
        <div className="story-edit-fields">
          <label>Profile introduction<textarea value={profile.dossierDescription} onChange={(event) => updateProfile({ dossierDescription: event.target.value })} /></label>
          <p className="mono edit-section-label">Profile details</p>
          {(profile.dossierFacts || FACTS).map(([label, value], index) => (
            <div className="dossier-edit-fact" key={`${label}-${index}`}>
              <label>{`Detail ${index + 1} label`}<input value={label} onChange={(event) => {
                const dossierFacts = [...(profile.dossierFacts || FACTS)]
                dossierFacts[index] = [event.target.value, value]
                updateProfile({ dossierFacts })
              }} /></label>
              <label>{`Detail ${index + 1} value`}<input value={value} onChange={(event) => {
                const dossierFacts = [...(profile.dossierFacts || FACTS)]
                dossierFacts[index] = [label, event.target.value]
                updateProfile({ dossierFacts })
              }} /></label>
            </div>
          ))}
          <p className="mono edit-section-label">Character traits</p>
          {(profile.traits || TRAITS).map(([title, text], index) => (
            <div className="dossier-edit-fact" key={`trait-${index}`}>
              <label>{`Trait ${index + 1}`}<input value={title} onChange={(event) => {
                const traits = [...(profile.traits || TRAITS)]
                traits[index] = [event.target.value, text]
                updateProfile({ traits })
              }} /></label>
              <label>Description<textarea value={text} onChange={(event) => {
                const traits = [...(profile.traits || TRAITS)]
                traits[index] = [title, event.target.value]
                updateProfile({ traits })
              }} /></label>
            </div>
          ))}
        </div>
      </details>

      <section className="dossier-lower">
        <div className="dossier-notes" data-reveal>
          <p className="kicker"><span>02</span> Observations</p>
          <h2>Field notes<br /><em>from the blue.</em></h2>
          <ol>
            {NOTES.map((note, index) => (
              <li key={note}><span className="mono">{String(index + 1).padStart(2, '0')}</span><p>{note}</p></li>
            ))}
          </ol>
        </div>
        <div className="dossier-traits">
          {(profile.traits || TRAITS).map(([title, text], index) => (
            <article className="dossier-trait" key={title} data-reveal>
              <span className="mono">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
