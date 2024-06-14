import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import X from "./icons/xLogo";
import { Link } from "@remix-run/react";
import { Separator } from "@radix-ui/react-separator";



export default function Footer() {

    return (
        <div className="flex items-center justify-center space-x-8 px-6 py-9 lg:px-12 text-foreground">
            <Link to="https://www.linkedin.com/in/jasonnnoll/">
                <LinkedInLogoIcon className="w-6 h-6" />
            </Link>
            <Separator orientation="vertical" className="h-5 w-[1px] bg-foreground" />
            <Link to="https://x.com/JasonNoll4">
                <X className="w-6 h-6" />
            </Link>
            <Separator orientation="vertical" className="h-5 w-[1px] bg-foreground" />
            <Link to="https://github.com/spaceassault">
                <GitHubLogoIcon className="w-6 h-6" />
            </Link>
        </div>
    );
}