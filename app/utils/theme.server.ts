import { createCookieSessionStorage } from "@remix-run/node";

import { getRequiredServerEnvVar } from "./misc";
import { Theme, isTheme } from "./theme-provider";

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "my_remix_theme",
    secure: true,
    secrets: [getRequiredServerEnvVar("SESSION_SECRET")],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => {
      const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      return themeStorage.commitSession(session, { expires });
    },
  };
}

export { getThemeSession };