import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import './App.css'

type ThemeKey = 'custom' | 'navy' | 'forest' | 'rose' | 'violet' | 'amber' | 'slate'

type ThemePalette = {
  label: string
  pageBackground: string
  pageText: string
  surface: string
  panel: string
  primary: string
  secondary: string
  tileBackground: string
  tileText: string
  buttonBackground: string
  buttonText: string
  border: string
}

type PresetThemeOption = {
  key: Exclude<ThemeKey, 'custom'>
  label: string
  swatches: [string, string, string]
}

type CustomTheme = {
  pageBackground: string
  pageText: string
  primary: string
  secondary: string
  tileBackground: string
  tileText: string
}

type StatItem = {
  id: string
  label: string
  note: string
}

type WorkItem = {
  id: string
  title: string
  detail: string
  image: string | null
  imageName: string
}

type TimelineItem = {
  id: string
  primary: string
  secondary: string
  date: string
}

type SiteContent = {
  brandEyebrow: string
  brandName: string
  sectionLabels: {
    profile: string
    selectedWork: string
    experience: string
    education: string
    skills: string
    press: string
    awards: string
    contact: string
  }
  hero: {
    intro: string
    meta: string
    image: string | null
    imageName: string
  }
  stats: StatItem[]
  work: WorkItem[]
  experience: TimelineItem[]
  education: TimelineItem[]
  skills: string[]
  awards: string[]
  contact: {
    nameLabel: string
    emailLabel: string
    messageLabel: string
    sendButton: string
  }
  footer: {
    titleLine: string
    titleAccent: string
    motto: string
    email: string
  }
}

const ADMIN_PASSWORD = 'admin123'

const DEFAULT_CUSTOM_THEME: CustomTheme = {
  pageBackground: '#111827',
  pageText: '#f9fafb',
  primary: '#7c4dff',
  secondary: '#f5a623',
  tileBackground: '#e8defd',
  tileText: '#251b45',
}

const DEFAULT_CONTENT: SiteContent = {
  brandEyebrow: 'Portfolio',
  brandName: 'Michelle Klaas',
  sectionLabels: {
    profile: 'Profile',
    selectedWork: 'Selected work',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    press: 'Press & features',
    awards: 'Awards & talks',
    contact: 'Get in touch',
  },
  hero: {
    intro: 'Designing experiences that connect people, brands, and products.',
    meta: 'I build thoughtful systems that help teams ship clearer, warmer, more strategic work.',
    image: null,
    imageName: 'profile-photo',
  },
  stats: [
    { id: 'clients', label: '[12+]', note: 'years growing brands' },
    { id: 'projects', label: '[40+]', note: 'product launches' },
    { id: 'awards', label: '[08]', note: 'industry recognitions' },
  ],
  work: [
    { id: 'northstar', title: 'Northstar Studio', detail: 'Brand & product strategy for a B2B design consultancy', image: null, imageName: 'Northstar cover' },
    { id: 'harbor', title: 'Harbor Labs', detail: 'Healthtech platform redesign and service journey mapping', image: null, imageName: 'Harbor cover' },
    { id: 'nexa', title: 'Nexa Commerce', detail: 'E-commerce experience refresh for higher conversion growth', image: null, imageName: 'Nexa cover' },
    { id: 'cinder', title: 'Cinder House', detail: 'Editorial direction and customer experience design for launch', image: null, imageName: 'Cinder cover' },
    { id: 'aster', title: 'Aster Research', detail: 'Strategic design system for multi-market SaaS rollout', image: null, imageName: 'Aster cover' },
    { id: 'kindred', title: 'Kindred Story', detail: 'Purpose-led campaign experience and community storytelling', image: null, imageName: 'Kindred cover' },
  ],
  experience: [
    { id: 'experience-1', primary: 'Design Director', secondary: 'Northstar Studio', date: '2022 — Present' },
    { id: 'experience-2', primary: 'Senior Product Designer', secondary: 'Harbor Labs', date: '2019 — 2022' },
    { id: 'experience-3', primary: 'Product Designer', secondary: 'Nexa Commerce', date: '2017 — 2019' },
    { id: 'experience-4', primary: 'Visual Designer', secondary: 'Freelance / boutique clients', date: '2015 — 2017' },
  ],
  education: [
    { id: 'education-1', primary: 'B.A. in Visual Communication', secondary: 'University of South Wales', date: '2014 — 2017' },
    { id: 'education-2', primary: 'UX & Service Design Certificate', secondary: 'Design School London', date: '2013 — 2014' },
    { id: 'education-3', primary: 'Interaction & Interface Design', secondary: 'Creative Futures Workshop', date: '2012 — 2013' },
  ],
  skills: ['Product strategy', 'UX writing', 'Brand systems', 'Design systems', 'Art direction', 'Workshop facilitation'],
  awards: ['Awwwards Honorable Mention', 'CSS Design Awards', 'FWA shortlist', 'Design Week recognition'],
  contact: {
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    sendButton: 'Send message',
  },
  footer: {
    titleLine: 'DESIGN',
    titleAccent: 'WITH PURPOSE',
    motto: 'STRATEGY | PRODUCT DESIGN | CULTURE & SYSTEMS',
    email: 'mchllklaas@gmail.com',
  },
}

const PRESET_THEME_OPTIONS: PresetThemeOption[] = [
  { key: 'navy', label: 'Navy', swatches: ['#050f2d', '#1d4ed8', '#f5a623'] },
  { key: 'forest', label: 'Forest', swatches: ['#0f2a1d', '#2e7d5c', '#d4a937'] },
  { key: 'rose', label: 'Rose', swatches: ['#2f1726', '#be4b76', '#f4ba5b'] },
  { key: 'violet', label: 'Violet', swatches: ['#1a1230', '#7c4dff', '#f5a623'] },
  { key: 'amber', label: 'Amber', swatches: ['#2a1808', '#d97706', '#f0b429'] },
  { key: 'slate', label: 'Slate', swatches: ['#111827', '#4b5563', '#c084fc'] },
]

const THEMES: Record<Exclude<ThemeKey, 'custom'>, ThemePalette> = {
  navy: { label: 'Navy', pageBackground: '#050f2d', pageText: '#f7f7f7', surface: '#f3f3f3', panel: '#f7f7f7', primary: '#1d4ed8', secondary: '#f5a623', tileBackground: '#dfe8ff', tileText: '#16213d', buttonBackground: '#081b3b', buttonText: '#ffffff', border: 'rgba(10, 24, 56, 0.12)' },
  forest: { label: 'Forest', pageBackground: '#0f2a1d', pageText: '#edf9f0', surface: '#f3f8f4', panel: '#f6faf7', primary: '#2e7d5c', secondary: '#d4a937', tileBackground: '#dff4e8', tileText: '#1a2f26', buttonBackground: '#173a2b', buttonText: '#ffffff', border: 'rgba(16, 47, 34, 0.12)' },
  rose: { label: 'Rose', pageBackground: '#2f1726', pageText: '#fff3f4', surface: '#f8f1f4', panel: '#fff8fa', primary: '#be4b76', secondary: '#f4ba5b', tileBackground: '#f9dfe9', tileText: '#3c1b2b', buttonBackground: '#5d1d35', buttonText: '#fffafc', border: 'rgba(67, 23, 41, 0.12)' },
  violet: { label: 'Violet', pageBackground: '#1a1230', pageText: '#f5f0ff', surface: '#f4f0fb', panel: '#faf7ff', primary: '#7c4dff', secondary: '#f5a623', tileBackground: '#e8defd', tileText: '#251b45', buttonBackground: '#311b5f', buttonText: '#ffffff', border: 'rgba(43, 25, 64, 0.12)' },
  amber: { label: 'Amber', pageBackground: '#2a1808', pageText: '#fffaf0', surface: '#fff5e9', panel: '#fff9f2', primary: '#d97706', secondary: '#f0b429', tileBackground: '#fbe3b8', tileText: '#3f2a0c', buttonBackground: '#7c4310', buttonText: '#fff8ed', border: 'rgba(78, 45, 10, 0.12)' },
  slate: { label: 'Slate', pageBackground: '#111827', pageText: '#f9fafb', surface: '#f2f5f8', panel: '#f7f9fb', primary: '#4b5563', secondary: '#c084fc', tileBackground: '#dde5ee', tileText: '#1a2433', buttonBackground: '#1f2937', buttonText: '#f9fafb', border: 'rgba(17, 24, 39, 0.12)' },
}

const getInitialTheme = (): ThemeKey => {
  if (typeof window === 'undefined') return 'navy'

  const savedTheme = window.localStorage.getItem('resume-theme')
  if (savedTheme === 'custom') return 'custom'
  if (savedTheme && savedTheme in THEMES) {
    return savedTheme as Exclude<ThemeKey, 'custom'>
  }

  return 'navy'
}

const getInitialCustomTheme = (): CustomTheme => {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_THEME

  try {
    const saved = window.localStorage.getItem('resume-custom-theme')
    if (!saved) return DEFAULT_CUSTOM_THEME

    return { ...DEFAULT_CUSTOM_THEME, ...JSON.parse(saved) }
  } catch {
    return DEFAULT_CUSTOM_THEME
  }
}

const getInitialContent = (): SiteContent => {
  if (typeof window === 'undefined') return DEFAULT_CONTENT

  try {
    const saved = window.localStorage.getItem('resume-site-content')
    if (!saved) return DEFAULT_CONTENT

    return { ...DEFAULT_CONTENT, ...JSON.parse(saved), sectionLabels: { ...DEFAULT_CONTENT.sectionLabels, ...(JSON.parse(saved).sectionLabels ?? {}) }, hero: { ...DEFAULT_CONTENT.hero, ...(JSON.parse(saved).hero ?? {}) }, contact: { ...DEFAULT_CONTENT.contact, ...(JSON.parse(saved).contact ?? {}) }, footer: { ...DEFAULT_CONTENT.footer, ...(JSON.parse(saved).footer ?? {}) } }
  } catch {
    return DEFAULT_CONTENT
  }
}

const getCurrentMode = (): 'public' | 'admin' => {
  if (typeof window === 'undefined') return 'public'

  return new URLSearchParams(window.location.search).get('mode') === 'admin' ? 'admin' : 'public'
}

const getThemePalette = (themeKey: ThemeKey, customColors: CustomTheme): ThemePalette => {
  if (themeKey === 'custom') {
    return {
      label: 'Custom',
      pageBackground: customColors.pageBackground,
      pageText: customColors.pageText,
      surface: '#f5f5f5',
      panel: '#f7f7f7',
      primary: customColors.primary,
      secondary: customColors.secondary,
      tileBackground: customColors.tileBackground,
      tileText: customColors.tileText,
      buttonBackground: customColors.primary,
      buttonText: '#ffffff',
      border: 'rgba(255,255,255,0.16)',
    }
  }

  return THEMES[themeKey]
}

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

function App() {
  const [currentTime, setCurrentTime] = useState(() =>
    new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date()),
  )
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>(getInitialTheme)
  const [customColors, setCustomColors] = useState<CustomTheme>(getInitialCustomTheme)
  const [siteContent, setSiteContent] = useState<SiteContent>(getInitialContent)
  const [viewMode, setViewMode] = useState<'public' | 'admin'>(getCurrentMode)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('resume-admin-auth') === 'true'
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      const formatted = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date())

      setCurrentTime(formatted)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('resume-theme', selectedTheme)
  }, [selectedTheme])

  useEffect(() => {
    window.localStorage.setItem('resume-custom-theme', JSON.stringify(customColors))
  }, [customColors])

  useEffect(() => {
    window.localStorage.setItem('resume-site-content', JSON.stringify(siteContent))
  }, [siteContent])

  useEffect(() => {
    window.localStorage.setItem('resume-admin-auth', String(isAdminAuthenticated))
  }, [isAdminAuthenticated])

  useEffect(() => {
    const handleLocationUpdate = () => {
      setViewMode(getCurrentMode())
    }

    window.addEventListener('popstate', handleLocationUpdate)
    return () => window.removeEventListener('popstate', handleLocationUpdate)
  }, [])

  const theme = getThemePalette(selectedTheme, customColors)

  const themeStyle = useMemo(
    () =>
      ({
        '--page-bg': theme.pageBackground,
        '--page-text': theme.pageText,
        '--surface': theme.surface,
        '--panel': theme.panel,
        '--primary': theme.primary,
        '--secondary': theme.secondary,
        '--tile-bg': theme.tileBackground,
        '--tile-text': theme.tileText,
        '--button-bg': theme.buttonBackground,
        '--button-text': theme.buttonText,
        '--border': theme.border,
      }) as CSSProperties,
    [theme],
  )

  const navigateToMode = (mode: 'public' | 'admin') => {
    const url = new URL(window.location.href)

    if (mode === 'admin') {
      url.searchParams.set('mode', 'admin')
    } else {
      url.searchParams.delete('mode')
    }

    window.history.pushState({}, '', url)
    setViewMode(mode)
  }

  const handleAdminLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      setAdminError('')
      navigateToMode('admin')
      return
    }

    setAdminError('Incorrect password. Please try again.')
  }

  const handleCustomColorChange = (key: keyof CustomTheme, value: string) => {
    setCustomColors((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const resetCustomTheme = () => {
    setSelectedTheme('custom')
    setCustomColors(DEFAULT_CUSTOM_THEME)
  }

  const updateSectionLabel = (key: keyof SiteContent['sectionLabels'], value: string) => {
    setSiteContent((current) => ({
      ...current,
      sectionLabels: {
        ...current.sectionLabels,
        [key]: value,
      },
    }))
  }

  const updateWorkItem = (id: string, field: 'title' | 'detail' | 'image' | 'imageName', value: string | null) => {
    setSiteContent((current) => ({
      ...current,
      work: current.work.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const updateTimelineItem = (id: string, field: 'primary' | 'secondary' | 'date', value: string, section: 'experience' | 'education') => {
    setSiteContent((current) => ({
      ...current,
      [section]: current[section].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const updateStatItem = (id: string, field: 'label' | 'note', value: string) => {
    setSiteContent((current) => ({
      ...current,
      stats: current.stats.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const addWorkItem = () => {
    const id = createId('work-item')
    setSiteContent((current) => ({
      ...current,
      work: [...current.work, { id, title: 'New project', detail: 'Project description', image: null, imageName: 'New project cover' }],
    }))
  }

  const removeWorkItem = (id: string) => {
    setSiteContent((current) => ({
      ...current,
      work: current.work.filter((item) => item.id !== id),
    }))
  }

  const handleImageUpload = (target: 'hero' | 'work', id?: string, file?: File | null) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''

      if (target === 'hero') {
        setSiteContent((current) => ({
          ...current,
          hero: { ...current.hero, image: result, imageName: file.name },
        }))
        return
      }

      if (id) {
        setSiteContent((current) => ({
          ...current,
          work: current.work.map((item) => (item.id === id ? { ...item, image: result, imageName: file.name } : item)),
        }))
      }
    }

    reader.readAsDataURL(file)
  }

  if (viewMode === 'admin' && !isAdminAuthenticated) {
    return (
      <main className="admin-shell" style={themeStyle}>
        <section className="admin-login-panel">
          <p className="eyebrow">Owner access</p>
          <h1>Theme administration</h1>
          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <label className="field-group admin-field">
              <span>Password</span>
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Enter admin password"
              />
            </label>
            {adminError ? <p className="error-message">{adminError}</p> : null}
            <button type="submit" className="primary-button full-width">
              Unlock admin panel
            </button>
          </form>
        </section>
      </main>
    )
  }

  if (viewMode === 'admin') {
    return (
      <main className="admin-shell" style={themeStyle}>
        <section className="admin-panel admin-panel-wide">
          <div className="admin-header">
            <p className="eyebrow">Admin controls</p>
            <h1>Identity and content manager</h1>
          </div>

          <div className="field-group admin-field">
            <span>Site color identity</span>
            <div className="theme-option-grid" role="list">
              <button
                type="button"
                className={`theme-option ${selectedTheme === 'custom' ? 'theme-option-active' : ''}`}
                onClick={() => setSelectedTheme('custom')}
              >
                <span className="theme-option-swatch custom-swatch" aria-hidden="true" />
                <span>Custom</span>
              </button>
              {PRESET_THEME_OPTIONS.map((themeOption) => (
                <button
                  key={themeOption.key}
                  type="button"
                  className={`theme-option ${selectedTheme === themeOption.key ? 'theme-option-active' : ''}`}
                  onClick={() => setSelectedTheme(themeOption.key)}
                >
                  <span className="theme-option-swatch" aria-hidden="true" style={{
                    background: `linear-gradient(135deg, ${themeOption.swatches[0]} 0%, ${themeOption.swatches[1]} 50%, ${themeOption.swatches[2]} 100%)`,
                  }} />
                  <span>{themeOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedTheme === 'custom' ? (
            <div className="custom-color-grid">
              <label className="mini-color-field">
                <span>Page background</span>
                <input type="color" value={customColors.pageBackground} onChange={(event) => handleCustomColorChange('pageBackground', event.target.value)} />
              </label>
              <label className="mini-color-field">
                <span>Page text</span>
                <input type="color" value={customColors.pageText} onChange={(event) => handleCustomColorChange('pageText', event.target.value)} />
              </label>
              <label className="mini-color-field">
                <span>Primary accent</span>
                <input type="color" value={customColors.primary} onChange={(event) => handleCustomColorChange('primary', event.target.value)} />
              </label>
              <label className="mini-color-field">
                <span>Secondary accent</span>
                <input type="color" value={customColors.secondary} onChange={(event) => handleCustomColorChange('secondary', event.target.value)} />
              </label>
              <label className="mini-color-field">
                <span>Tile background</span>
                <input type="color" value={customColors.tileBackground} onChange={(event) => handleCustomColorChange('tileBackground', event.target.value)} />
              </label>
              <label className="mini-color-field">
                <span>Tile text</span>
                <input type="color" value={customColors.tileText} onChange={(event) => handleCustomColorChange('tileText', event.target.value)} />
              </label>
            </div>
          ) : null}

          <div className="admin-section">
            <h2>Brand and section labels</h2>
            <div className="editor-grid two-up">
              <label className="admin-input">
                <span>Portfolio label</span>
                <input value={siteContent.brandEyebrow} onChange={(event) => setSiteContent((current) => ({ ...current, brandEyebrow: event.target.value }))} />
              </label>
              <label className="admin-input">
                <span>Owner name</span>
                <input value={siteContent.brandName} onChange={(event) => setSiteContent((current) => ({ ...current, brandName: event.target.value }))} />
              </label>
              <label className="admin-input full-span">
                <span>Profile tab label</span>
                <input value={siteContent.sectionLabels.profile} onChange={(event) => updateSectionLabel('profile', event.target.value)} />
              </label>
              <label className="admin-input">
                <span>Work tab label</span>
                <input value={siteContent.sectionLabels.selectedWork} onChange={(event) => updateSectionLabel('selectedWork', event.target.value)} />
              </label>
              <label className="admin-input">
                <span>Experience tab label</span>
                <input value={siteContent.sectionLabels.experience} onChange={(event) => updateSectionLabel('experience', event.target.value)} />
              </label>
              <label className="admin-input">
                <span>Education tab label</span>
                <input value={siteContent.sectionLabels.education} onChange={(event) => updateSectionLabel('education', event.target.value)} />
              </label>
              <label className="admin-input">
                <span>Skills tab label</span>
                <input value={siteContent.sectionLabels.skills} onChange={(event) => updateSectionLabel('skills', event.target.value)} />
              </label>
              <label className="admin-input">
                <span>Press tab label</span>
                <input value={siteContent.sectionLabels.press} onChange={(event) => updateSectionLabel('press', event.target.value)} />
              </label>
              <label className="admin-input">
                <span>Awards tab label</span>
                <input value={siteContent.sectionLabels.awards} onChange={(event) => updateSectionLabel('awards', event.target.value)} />
              </label>
              <label className="admin-input full-span">
                <span>Contact tab label</span>
                <input value={siteContent.sectionLabels.contact} onChange={(event) => updateSectionLabel('contact', event.target.value)} />
              </label>
            </div>
          </div>

          <div className="admin-section">
            <h2>Hero block</h2>
            <div className="editor-grid two-up">
              <label className="admin-input full-span">
                <span>Intro title</span>
                <textarea value={siteContent.hero.intro} onChange={(event) => setSiteContent((current) => ({ ...current, hero: { ...current.hero, intro: event.target.value } }))} />
              </label>
              <label className="admin-input full-span">
                <span>Intro detail</span>
                <textarea value={siteContent.hero.meta} onChange={(event) => setSiteContent((current) => ({ ...current, hero: { ...current.hero, meta: event.target.value } }))} />
              </label>
              <label className="admin-input full-span image-upload">
                <span>Hero image</span>
                <input type="file" accept="image/*" onChange={(event) => handleImageUpload('hero', undefined, event.target.files?.[0] ?? null)} />
                {siteContent.hero.image ? <img src={siteContent.hero.image} alt={siteContent.hero.imageName} /> : <div className="upload-empty">No image uploaded</div>}
              </label>
            </div>
          </div>

          <div className="admin-section">
            <h2>Summary stats</h2>
            <div className="stacked-list">
              {siteContent.stats.map((stat) => (
                <div key={stat.id} className="mini-editor">
                  <label className="admin-input">
                    <span>Value</span>
                    <input value={stat.label} onChange={(event) => updateStatItem(stat.id, 'label', event.target.value)} />
                  </label>
                  <label className="admin-input">
                    <span>Caption</span>
                    <input value={stat.note} onChange={(event) => updateStatItem(stat.id, 'note', event.target.value)} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>Selected work</h2>
            <div className="stacked-list">
              {siteContent.work.map((item) => (
                <div key={item.id} className="mini-editor">
                  <label className="admin-input">
                    <span>Project title</span>
                    <input value={item.title} onChange={(event) => updateWorkItem(item.id, 'title', event.target.value)} />
                  </label>
                  <label className="admin-input full-span">
                    <span>Project detail</span>
                    <textarea value={item.detail} onChange={(event) => updateWorkItem(item.id, 'detail', event.target.value)} />
                  </label>
                  <label className="admin-input full-span image-upload">
                    <span>Project image</span>
                    <input type="file" accept="image/*" onChange={(event) => handleImageUpload('work', item.id, event.target.files?.[0] ?? null)} />
                    {item.image ? <img src={item.image} alt={item.imageName} /> : <div className="upload-empty">No image uploaded</div>}
                  </label>
                  <button type="button" className="secondary-button remove-button" onClick={() => removeWorkItem(item.id)}>
                    Remove item
                  </button>
                </div>
              ))}
              <button type="button" className="primary-button" onClick={addWorkItem}>Add project</button>
            </div>
          </div>

          <div className="admin-section">
            <h2>Experience and education</h2>
            <div className="stacked-list">
              <div className="mini-editor split-editor">
                <div>
                  <h3>Experience</h3>
                  {siteContent.experience.map((item) => (
                    <div key={item.id} className="mini-editor nested-mini">
                      <label className="admin-input">
                        <span>Role</span>
                        <input value={item.primary} onChange={(event) => updateTimelineItem(item.id, 'primary', event.target.value, 'experience')} />
                      </label>
                      <label className="admin-input">
                        <span>Company</span>
                        <input value={item.secondary} onChange={(event) => updateTimelineItem(item.id, 'secondary', event.target.value, 'experience')} />
                      </label>
                      <label className="admin-input">
                        <span>Date</span>
                        <input value={item.date} onChange={(event) => updateTimelineItem(item.id, 'date', event.target.value, 'experience')} />
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  <h3>Education</h3>
                  {siteContent.education.map((item) => (
                    <div key={item.id} className="mini-editor nested-mini">
                      <label className="admin-input">
                        <span>Course</span>
                        <input value={item.primary} onChange={(event) => updateTimelineItem(item.id, 'primary', event.target.value, 'education')} />
                      </label>
                      <label className="admin-input">
                        <span>School</span>
                        <input value={item.secondary} onChange={(event) => updateTimelineItem(item.id, 'secondary', event.target.value, 'education')} />
                      </label>
                      <label className="admin-input">
                        <span>Date</span>
                        <input value={item.date} onChange={(event) => updateTimelineItem(item.id, 'date', event.target.value, 'education')} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-section">
            <h2>Skills and awards</h2>
            <div className="editor-grid two-up">
              <label className="admin-input full-span">
                <span>Skills</span>
                <textarea value={siteContent.skills.join('\n')} onChange={(event) => setSiteContent((current) => ({ ...current, skills: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }))} />
              </label>
              <label className="admin-input full-span">
                <span>Awards and features</span>
                <textarea value={siteContent.awards.join('\n')} onChange={(event) => setSiteContent((current) => ({ ...current, awards: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }))} />
              </label>
            </div>
          </div>

          <div className="admin-section">
            <h2>Contact form texts</h2>
            <div className="editor-grid two-up">
              <label className="admin-input">
                <span>Name field label</span>
                <input value={siteContent.contact.nameLabel} onChange={(event) => setSiteContent((current) => ({ ...current, contact: { ...current.contact, nameLabel: event.target.value } }))} />
              </label>
              <label className="admin-input">
                <span>Email field label</span>
                <input value={siteContent.contact.emailLabel} onChange={(event) => setSiteContent((current) => ({ ...current, contact: { ...current.contact, emailLabel: event.target.value } }))} />
              </label>
              <label className="admin-input full-span">
                <span>Message field label</span>
                <input value={siteContent.contact.messageLabel} onChange={(event) => setSiteContent((current) => ({ ...current, contact: { ...current.contact, messageLabel: event.target.value } }))} />
              </label>
              <label className="admin-input full-span">
                <span>Submit button text</span>
                <input value={siteContent.contact.sendButton} onChange={(event) => setSiteContent((current) => ({ ...current, contact: { ...current.contact, sendButton: event.target.value } }))} />
              </label>
            </div>
          </div>

          <div className="admin-section">
            <h2>Brand footer</h2>
            <div className="editor-grid two-up">
              <label className="admin-input">
                <span>Primary footer title</span>
                <input value={siteContent.footer.titleLine} onChange={(event) => setSiteContent((current) => ({ ...current, footer: { ...current.footer, titleLine: event.target.value } }))} />
              </label>
              <label className="admin-input">
                <span>Accent footer title</span>
                <input value={siteContent.footer.titleAccent} onChange={(event) => setSiteContent((current) => ({ ...current, footer: { ...current.footer, titleAccent: event.target.value } }))} />
              </label>
              <label className="admin-input full-span">
                <span>Motto</span>
                <input value={siteContent.footer.motto} onChange={(event) => setSiteContent((current) => ({ ...current, footer: { ...current.footer, motto: event.target.value } }))} />
              </label>
              <label className="admin-input full-span">
                <span>Email</span>
                <input value={siteContent.footer.email} onChange={(event) => setSiteContent((current) => ({ ...current, footer: { ...current.footer, email: event.target.value } }))} />
              </label>
            </div>
          </div>

          <div className="admin-actions">
            <button className="secondary-button" type="button" onClick={resetCustomTheme}>Reset theme</button>
            <button className="secondary-button" type="button" onClick={() => setIsAdminAuthenticated(false)}>Lock admin</button>
            <button className="primary-button" type="button" onClick={() => navigateToMode('public')}>View public site</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="site-shell" style={themeStyle}>
      <div className="resume-shell">
        <header className="status-bar">
          <div className="time">{currentTime}</div>
          <div className="status-icons" aria-label="device status">
            <span className="signal signal-one" aria-hidden="true" />
            <span className="signal signal-two" aria-hidden="true" />
            <span className="signal signal-three" aria-hidden="true" />
          </div>
        </header>

        <div className="panel-top">
          <button className="icon-button close" aria-label="Close">×</button>
          <div className="identity-block">
            <p className="eyebrow-mini">{siteContent.brandEyebrow}</p>
            <h1>{siteContent.brandName}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-button" aria-label="Comment">◌</button>
            <button className="icon-button" aria-label="Share">⇪</button>
          </div>
        </div>

        <div className="toolbar">
          <button className="nav-button" aria-label="Back">‹</button>
          <div className="breadcrumb">Home (desktop, scroll...</div>
          <div className="toolbar-icons">
            <button className="icon-button subtle" aria-label="Download">↓</button>
          </div>
          <div className="mode-toggle">
            <button className="toggle-button active">Fill</button>
            <button className="toggle-button">Fit</button>
          </div>
        </div>

        <main className="document">
          <section className="canvas-block hero-block">
            <div className="block-header">{siteContent.sectionLabels.profile}</div>
            <div className="hero-card">
              <div className="hero-box" style={siteContent.hero.image ? { backgroundImage: `url(${siteContent.hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                {!siteContent.hero.image ? <div className="hero-shape" /> : null}
              </div>
              <div className="hero-copy">
                <p className="hero-intro">{siteContent.hero.intro}</p>
                <p className="hero-meta">{siteContent.hero.meta}</p>
              </div>
            </div>
          </section>

          <section className="stats-grid">
            {siteContent.stats.map((stat) => (
              <div key={stat.id} className="stat-item">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-note">{stat.note}</div>
              </div>
            ))}
          </section>

          <section className="canvas-block">
            <div className="section-label-row">
              <span>{siteContent.sectionLabels.selectedWork}</span>
            </div>
            <div className="work-grid">
              {siteContent.work.map((item) => (
                <article key={item.id} className="work-card">
                  <div
                    className="work-preview"
                    style={
                      item.image
                        ? {
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : undefined
                    }
                  />
                  <div className="work-title">{item.title}</div>
                  <div className="work-detail">{item.detail}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="canvas-block two-column-block">
            <div className="two-column-head">
              <span>{siteContent.sectionLabels.experience} &amp; {siteContent.sectionLabels.education}</span>
            </div>
            <div className="split-columns">
              <div>
                <h2>{siteContent.sectionLabels.experience}</h2>
                {siteContent.experience.map((item) => (
                  <div key={item.id} className="meta-row">
                    <div className="meta-title">{item.primary}</div>
                    <div className="meta-subtitle">{item.secondary}</div>
                    <div className="meta-date">{item.date}</div>
                  </div>
                ))}
              </div>
              <div>
                <h2>{siteContent.sectionLabels.education}</h2>
                {siteContent.education.map((item) => (
                  <div key={item.id} className="meta-row">
                    <div className="meta-title">{item.primary}</div>
                    <div className="meta-subtitle">{item.secondary}</div>
                    <div className="meta-date">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="canvas-block mini-grid">
            <div className="mini-column">
              <h2>{siteContent.sectionLabels.skills}</h2>
              <ul>
                {siteContent.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
            <div className="mini-column">
              <h2>{siteContent.sectionLabels.press}</h2>
              <ul>
                {siteContent.awards.map((award) => <li key={award}>{award}</li>)}
              </ul>
            </div>
            <div className="mini-column">
              <h2>{siteContent.sectionLabels.awards}</h2>
              <ul>
                {siteContent.awards.map((award) => <li key={`${award}-award`}>{award}</li>)}
              </ul>
            </div>
          </section>

          <section className="canvas-block contact-block">
            <h2>{siteContent.sectionLabels.contact}</h2>
            <div className="form-grid">
              <div className="field-group">
                <label>{siteContent.contact.nameLabel}</label>
                <input type="text" value="" readOnly aria-label={siteContent.contact.nameLabel} />
              </div>
              <div className="field-group">
                <label>{siteContent.contact.emailLabel}</label>
                <input type="email" value="" readOnly aria-label={siteContent.contact.emailLabel} />
              </div>
              <div className="field-group full-width">
                <label>{siteContent.contact.messageLabel}</label>
                <textarea value="" readOnly aria-label={siteContent.contact.messageLabel} />
              </div>
            </div>
            <button className="submit-button">{siteContent.contact.sendButton}</button>
          </section>
        </main>
      </div>

      <section className="brand-addendum">
        <div className="brand-content">
          <h1 className="brand-title">
            {siteContent.footer.titleLine} <span>{siteContent.footer.titleAccent}</span>
          </h1>

          <p className="brand-motto">{siteContent.footer.motto}</p>

          <div className="divider" aria-hidden="true" />

          <div className="contact-row">
            <div className="email-icon" aria-hidden="true">
              <span>✉</span>
            </div>
            <a href={`mailto:${siteContent.footer.email}`}>{siteContent.footer.email}</a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
