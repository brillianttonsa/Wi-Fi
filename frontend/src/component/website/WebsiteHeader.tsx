import { Button, Logo } from "../shared";
import type { WebsiteActions } from "./types";

export function WebsiteHeader({ onLogin, onRegister }: WebsiteActions) {
  return (
    <header id="top" className="mx-auto border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-5 md:px-8 lg:px-10 gap-4 flex max-w-full">
      <Logo />
      <div className="hidden sm:flex items-center gap-2">
        <Button variant="ghost" className="text-xs sm:text-sm" onClick={onLogin}>Log in</Button>
        <Button onClick={onRegister} className="text-[5px] sm:text-sm">Get connected</Button>
      </div>
      </div>
    </header>
  );
}