interface NavigatorUAData {
  getHighEntropyValues(hints: string[]): Promise<{ [key: string]: string }>
  platform: string
  brands: { brand: string; version: string }[]
  mobile: boolean
}

export interface ExtendedNavigator extends Navigator {
  userAgentData?: NavigatorUAData
}

export const getOS = async (navigator: ExtendedNavigator): Promise<string> => {
  if (navigator.userAgentData) {
    const uaData = await navigator.userAgentData.getHighEntropyValues(['platform'])
    return uaData.platform
  } else {
    const userAgent = navigator.userAgent

    if (/Windows NT/.test(userAgent)) {
      return 'Windows'
    } else if (/Mac OS X/.test(userAgent)) {
      return 'Mac OS'
    } else if (/Android/.test(userAgent)) {
      return 'Android'
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      return 'iOS'
    } else if (/Linux/.test(userAgent)) {
      return 'Linux'
    } else {
      return 'Unknown'
    }
  }
}
