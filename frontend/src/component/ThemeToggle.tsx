import { useTheme } from "../hooks/useTheme";
import { Icon } from "./shared";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const blackThemeEnabled = theme === "black";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={blackThemeEnabled ? "Use light theme" : "Use black theme"}
      title={blackThemeEnabled ? "Use light theme" : "Use black theme"}
      className="grid h-9 w-9 place-items-center rounded-xl text-[#12201d] transition hover:bg-white"
    >
      <Icon name={blackThemeEnabled ? "sun" : "moon"} size={17} />
    </button>
  );
}
