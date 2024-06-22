import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { useFetcher } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Theme, useTheme } from "~/utils/theme-provider"

export interface DarkModeToggleProps {
  handleThemeChange: (theme: Theme) => void;
}

export function DarkModeToggle({ handleThemeChange }: DarkModeToggleProps) {
  const fetcher = useFetcher();
  const currentTheme = useTheme();
  const [theme, setTheme] = currentTheme;

  const handleChange = (newTheme: Theme) => {
    setTheme(newTheme);
    handleThemeChange(newTheme);
    fetcher.submit(
      { theme: newTheme },
      { method: "post", action: "/action/set-theme" }
    );
  }

  const renderIcon = () => {
    switch (theme) {
      case Theme.LIGHT:
        return <SunIcon />
      case Theme.DARK:
        return <MoonIcon />
      default:
        return <SunIcon />
    }
  }

  return (
    <Button variant="outline" onClick={() => handleChange(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}>
      {renderIcon()}
    </Button>
  )
}
