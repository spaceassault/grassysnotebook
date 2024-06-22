import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { getThemeSession } from "~/utils/theme.server";
import { isTheme, Theme } from "~/utils/theme-provider";
import { useFetcher } from "@remix-run/react";
import { DarkModeToggle } from "~/components/dark-mode-toggle";

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    });
  }

  themeSession.setTheme(theme);
  return json(
    { success: true },
    { headers: { "Set-Cookie": await themeSession.commit() } }
  );
};

export function ThemeSwitch() {
  const fetcher = useFetcher();

  const handleSelect = (themeValue: Theme) => {
    fetcher.submit(
      { theme: themeValue },
      { method: "post", action: "/action/set-theme" }
    );
  };

  return <DarkModeToggle handleThemeChange={handleSelect} />;
}

export const loader: LoaderFunction = () => redirect("/", { status: 404 });