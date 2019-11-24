let Services

const targetPlatform = (process.env['TARGET_PLATFORM'] || 'web').trim().toLowerCase()

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
