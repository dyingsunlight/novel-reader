export default function (args: string[]): {[key: string]: string} {
  return args.filter(arg => arg.startsWith('--')).reduce((prev, arg) => {
    const segments = arg.split('=')
    if (segments.length <= 1) return
    const key = segments[0].replace(/^--/, '')
    const value = segments[1]
    prev[key] =  value
    return prev
  }, {})
}
