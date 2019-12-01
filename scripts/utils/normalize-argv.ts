export default function (args: string[]): {[key: string]: string} {
  return args.filter(arg => arg.startsWith('--')).reduce((prev, arg) => {
    const segments = arg.split('=')
    if (segments.length === 2) {
      const key = segments[0].replace(/^--/, '')
      const value = segments[1]
      prev[key] = value
    } else if (segments.length) {
      const arg = segments[0].replace(/^--/, '')
      prev[arg] =  arg
    }
    return prev
  }, {})
}
