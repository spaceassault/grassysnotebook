import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import styles from '~/tailwind.css?url'
import Navbar from "./components/navbar";
import { getThemeSession } from "~/lib/theme.server";
import { NonFlashOfWrongThemeEls, Theme, ThemeProvider, useTheme } from "~/lib/theme-provider";
import clsx from "clsx";
import ErrorPage from "./components/errorPage";
import { ReactNode } from "react";
import Footer from "./components/footer";
import ProgressBar from "./components/progressbar";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/remix"
import { honeypot } from "./lib/honeypot.server";
import { HoneypotProvider } from 'remix-utils/honeypot/react';

// Use the links function to include the stylesheet
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  
];

export const meta: MetaFunction = ({ data }) => {
	return [
		{ title: data ? 'Grassys Notebook' : 'Error | Blog' },
		{ name: 'description', content: `Your tursted source for aviation, technology, and finance trends` },
	]
}

export type LoaderData = {
  theme: Theme | null;
  honeyProps: ReturnType<typeof honeypot.getInputProps>;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const themeSession = await getThemeSession(request);
  const honeyProps = honeypot.getInputProps()

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    honeyProps,
  };

  return data;
}

export interface DocumentProps {
  title?: string;
  children?: ReactNode;
}

function App({ title }: DocumentProps) {
  const data = useLoaderData<LoaderData>();

  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        {title && <title>{title}</title>}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="bg-background min-w-full min-h-full">
        <Analytics />
        <SpeedInsights />
        <ProgressBar />
        <Navbar />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <HoneypotProvider {...data.honeyProps}>
      <ThemeProvider specifiedTheme={data.theme} >
        <App />
      </ThemeProvider>
    </HoneypotProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    // If it's a 404 error
    if (error.status === 404) {
      return (
            <ErrorPage title="404 - Page Not Found">
              <p>Sorry, the page you were trying to view does not exist.</p>
            </ErrorPage>
      );
    }
    // Any other error
    return (
          <ErrorPage title="An error occurred" errorCode={error.status} >
            <p>
              {error.data?.message || 'Something went wrong. Please try again later.'}
            </p>
          </ErrorPage>
    );
  } else if (error instanceof Error) {
    return (
          <ErrorPage title="An error occurred">
            <p>{error.message || 'Something went wrong. Please try again later.'}</p>
          </ErrorPage>
    );
  }
}


