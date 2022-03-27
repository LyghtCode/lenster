import * as Sentry from '@sentry/nextjs'
import { NextPageContext } from 'next'
import NextErrorComponent from 'next/error'

const MyError = ({ statusCode, hasGetInitialPropsRun, err }: any) => {
  if (!hasGetInitialPropsRun && err) {
    Sentry.captureException(err)
  }

  return <NextErrorComponent statusCode={statusCode} />
}
interface Context extends NextPageContext {}
MyError.getInitialProps = async (context: Context) => {
  const errorInitialProps: any = await NextErrorComponent.getInitialProps(
    context
  )

  const { res, err, asPath } = context

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true

  // Returning early because we don't want to log 404 errors to Sentry.
  if (res?.statusCode === 404) {
    return errorInitialProps
  }

  if (err) {
    Sentry.captureException(err)

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000)

    return errorInitialProps
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  )
  await Sentry.flush(2000)

  return errorInitialProps
}

export default MyError
