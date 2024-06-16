import { Input } from "~/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { NavLink } from "@remix-run/react";
import { ThemeSwitch } from "~/routes/action.set-theme";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import LogoHorizontal from "./icons/logo-horizontal";

export default function Navbar() {
  

  return (
    <>
    <nav className="flex items-center justify-between px-6 py-9 lg:px-12 text-foreground">
      <div className="flex items-center space-x-6">
      <NavLink to="/" className="ml-8 text-2xl md:text-3xl lg:text-4xl font-bold" prefetch="intent">
        <LogoHorizontal className="h-auto w-96 max-w-[14rem] md:max-w-[24rem] lg:max-w-[28rem]" />
        {/* <img
            className="h-28 w-auto"
            src="/logo2.png"
            alt="GrassyNoll"
            /> */}
        </NavLink>
      </div>
      {/* <div className="flex items-center space-x-6 mr-10">
        <MagnifyingGlassIcon className="w-6 h-6" />
        <Input placeholder="Search" className="h-8" />
      </div> */}
      <div className="hidden md:flex md:items-center md:space-x-6">
        <NavLink to="/" className="hover:underline" prefetch="intent">
          Home 
        </NavLink>
        <Separator orientation="vertical" className="h-5 w-[1px] bg-foreground" />
        <NavLink to="/about/index" className="hover:underline" prefetch="intent">
          About
        </NavLink>
        <Separator orientation="vertical" className="h-5 w-[1px] bg-foreground" />
        <ThemeSwitch />
      </div>
      <div className="block md:hidden items-center">
        <DropdownMenu >
          <DropdownMenuTrigger>
              <HamburgerMenuIcon className="w-6 h-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-8">
            <DropdownMenuGroup >
                <DropdownMenuItem >
                  <NavLink to="/" prefetch="intent">
                  Home
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <NavLink to="/about/index" prefetch="intent" >
                  About
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <ThemeSwitch />
                </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
    </>
  );
}
