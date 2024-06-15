import * as React from "react";
import { useLocation } from "@remix-run/react";
import { SlashIcon } from "@radix-ui/react-icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="text-sm md:text-lg lg:text-xl">
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (
            <React.Fragment key={to}>
              <SlashIcon />
              <BreadcrumbItem className="text-sm md:text-lg lg:text-xl">
                {isLast ? (
                  <BreadcrumbPage>{capitalizeFirstLetter(value)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={to}>
                    {capitalizeFirstLetter(value)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
