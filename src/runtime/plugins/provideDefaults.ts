/* eslint-disable no-console */
// @ts-expect-error - Missing Nitro type exports in Nuxt
import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { subtle } from 'uncrypto'
import { arrayBufferToBase64 } from 'undio'
import { generateRandomUrlSafeString } from '../server/utils/security'

export default defineNitroPlugin(async () => {
  
  if (!useRuntimeConfig().oidc.secret.sessionSecret || useRuntimeConfig().oidc.secret.sessionSecret.length < 48) {
    const randomSecret = generateRandomUrlSafeString()
    useRuntimeConfig().oidc.secret.sessionSecret = randomSecret
    console.warn('[nuxt-oidc-auth]: No session secret set, using a random secret. Please set NUXT_OIDC_SESSION_SECRET in your environment with at least 48 chars.')
    console.info(`[nuxt-oidc-auth]: NUXT_OIDC_SESSION_SECRET=${randomSecret}`)
  }
  if (!useRuntimeConfig().oidc.secret.tokenKey) {
    const randomKey = arrayBufferToBase64(await subtle.exportKey('raw', await subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])), {})
    useRuntimeConfig().oidc.secret.tokenKey = randomKey
    console.warn('[nuxt-oidc-auth]: No refresh token key set, using a random key. Please set NUXT_OIDC_TOKEN_KEY in your environment. Refresh tokens saved in this session will be inaccessible after a server restart.')
    console.info(`[nuxt-oidc-auth]: NUXT_OIDC_TOKEN_KEY=${randomKey}`)
  }
  if (!useRuntimeConfig().oidc.secret.authSessionSecret) {
    const randomKey = generateRandomUrlSafeString()
    useRuntimeConfig().oidc.secret.authSessionSecret = randomKey
    console.warn('[nuxt-oidc-auth]: No auth session secret set, using a random secret. Please set NUXT_OIDC_AUTH_SESSION_SECRET in your environment.')
    console.info(`[nuxt-oidc-auth]: NUXT_OIDC_AUTH_SESSION_SECRET=${randomKey}`)
  }
})
