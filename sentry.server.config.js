import * as Sentry from '@sentry/nextjs'

import { IS_PRODUCTION, SENTRY_DSN } from './src/constants'

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: IS_PRODUCTION,
  tracesSampleRate: 1.0
})
