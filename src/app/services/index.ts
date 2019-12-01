let Services

const targetPlatform = (process.env['TARGET'] || 'web').trim().toLowerCase()

console.log('RUNNING IN MODE: ', targetPlatform)

if (targetPlatform === 'electron') {
  Services = require('./electron')
}

if (targetPlatform === 'web') {
  Services = require('./web')
}

export const Translation = Services.Translation
export const SessionStorage = Services.SessionStorage
export const LocalStorage = Services.LocalStorage
export const Resolver = Services.Resolver
