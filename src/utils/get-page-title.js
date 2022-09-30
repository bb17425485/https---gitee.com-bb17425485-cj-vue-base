import defaultSettings from '@/settings'

const title = defaultSettings.title || '选品王管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
