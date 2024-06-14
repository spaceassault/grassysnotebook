import { Link } from "@remix-run/react";

export interface ErrorProps {
    title?: string;
    children?: React.ReactNode;
    errorCode?: number;
  }

export default function ErrorPage({ title, children, errorCode }: ErrorProps) {
    return (
        <main className="grid min-h-full place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-LightGreen-600">{errorCode || "Error"}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-6 text-base leading-7 text-muted">{children}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          <p>Back to <Link to="/" prefetch="intent">Home</Link>.</p>
          </div>
        </div>
      </main>
    );
}