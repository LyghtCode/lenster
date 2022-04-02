import * as Sentry from '@sentry/nextjs'

import { SENTRY_DSN } from './src/constants'

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0
})
