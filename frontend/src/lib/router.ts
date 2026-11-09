import type { PortalTab } from '@/components/portal/Sidebar'

export type AppView = 'landing' | 'portal' | 'login' | 'register'

export interface RouteState {
  view: AppView
  tab?: PortalTab
}

export const VALID_PORTAL_TABS: PortalTab[] = [
  'overview',
  'courses',
  'assignments',
  'grades',
  'schedule',
  'activities',
]

/**
 * Parse current URL (hash or pathname) into view and tab state.
 * Supports #/portal/courses, #/login, #/register, #/, as well as pathname fallbacks.
 */
export function parseRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { view: 'landing' }
  }

  let hash = window.location.hash || ''
  if (hash.startsWith('#')) {
    hash = hash.slice(1)
  }

  // Preserve in-page section jump anchors on landing page (#features, #quyche, #faq)
  if (hash === 'features' || hash === 'quyche' || hash === 'faq') {
    return { view: 'landing' }
  }

  let rawPath = hash.startsWith('/') ? hash.slice(1) : hash
  if (!rawPath) {
    const pathname = window.location.pathname.replace(/^\//, '')
    if (pathname) {
      rawPath = pathname
    }
  }

  const [segment1, segment2] = rawPath.split('/').filter(Boolean)

  if (segment1 === 'login') {
    return { view: 'login' }
  }
  if (segment1 === 'register') {
    return { view: 'register' }
  }
  if (segment1 === 'portal') {
    const tab = VALID_PORTAL_TABS.includes(segment2 as PortalTab)
      ? (segment2 as PortalTab)
      : 'overview'
    return { view: 'portal', tab }
  }
  if (segment1 === 'landing') {
    return { view: 'landing' }
  }

  // Root fallback: if authenticated user exists in storage, default to portal
  const hasStoredUser = !!localStorage.getItem('cnpm_current_user')
  if (hasStoredUser) {
    const savedTab = localStorage.getItem('cnpm_last_tab') as PortalTab
    const tab = VALID_PORTAL_TABS.includes(savedTab) ? savedTab : 'overview'
    return { view: 'portal', tab }
  }

  return { view: 'landing' }
}

/**
 * Build canonical hash URL string for given view and tab.
 */
export function buildRouteUrl(view: AppView, tab?: PortalTab): string {
  switch (view) {
    case 'login':
      return '#/login'
    case 'register':
      return '#/register'
    case 'portal':
      return `#/portal/${tab || 'overview'}`
    case 'landing':
    default:
      return '#/'
  }
}

/**
 * Synchronize the browser URL and history without causing page reloads.
 */
export function syncUrl(view: AppView, tab?: PortalTab, replace: boolean = false): void {
  if (typeof window === 'undefined') return

  const targetUrl = buildRouteUrl(view, tab)
  if (window.location.hash !== targetUrl) {
    if (replace) {
      window.history.replaceState(null, '', targetUrl)
    } else {
      window.history.pushState(null, '', targetUrl)
    }
  }

  if (view === 'portal' && tab) {
    localStorage.setItem('cnpm_last_tab', tab)
  }
}

