import { describe, it, expect, beforeEach } from 'vitest'
import { parseRoute, buildRouteUrl, syncUrl } from '../lib/router'

describe('Simple Router Utility', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = ''
    window.history.replaceState(null, '', '/')
  })

  it('builds canonical route URLs', () => {
    expect(buildRouteUrl('landing')).toBe('#/')
    expect(buildRouteUrl('login')).toBe('#/login')
    expect(buildRouteUrl('register')).toBe('#/register')
    expect(buildRouteUrl('portal', 'courses')).toBe('#/portal/courses')
    expect(buildRouteUrl('portal', 'grades')).toBe('#/portal/grades')
    expect(buildRouteUrl('portal')).toBe('#/portal/overview')
  })

  it('parses hash routes correctly on page reload', () => {
    window.location.hash = '#/portal/courses'
    expect(parseRoute()).toEqual({ view: 'portal', tab: 'courses' })

    window.location.hash = '#/portal/grades'
    expect(parseRoute()).toEqual({ view: 'portal', tab: 'grades' })

    window.location.hash = '#/login'
    expect(parseRoute()).toEqual({ view: 'login' })

    window.location.hash = '#/register'
    expect(parseRoute()).toEqual({ view: 'register' })

    window.location.hash = '#/'
    expect(parseRoute()).toEqual({ view: 'landing' })
  })

  it('handles in-page anchors on landing page without switching view', () => {
    window.location.hash = '#features'
    expect(parseRoute()).toEqual({ view: 'landing' })

    window.location.hash = '#quyche'
    expect(parseRoute()).toEqual({ view: 'landing' })

    window.location.hash = '#faq'
    expect(parseRoute()).toEqual({ view: 'landing' })
  })

  it('defaults invalid portal tab to overview', () => {
    window.location.hash = '#/portal/nonexistent_tab'
    expect(parseRoute()).toEqual({ view: 'portal', tab: 'overview' })
  })

  it('restores last saved portal tab when authenticated user reloads without hash', () => {
    window.location.hash = ''
    localStorage.setItem('cnpm_current_user', JSON.stringify({ username: 'sv_20210001' }))
    localStorage.setItem('cnpm_last_tab', 'schedule')

    expect(parseRoute()).toEqual({ view: 'portal', tab: 'schedule' })
  })

  it('syncUrl updates browser location and localStorage', () => {
    syncUrl('portal', 'activities')
    expect(window.location.hash).toBe('#/portal/activities')
    expect(localStorage.getItem('cnpm_last_tab')).toBe('activities')

    syncUrl('login')
    expect(window.location.hash).toBe('#/login')
  })
})

