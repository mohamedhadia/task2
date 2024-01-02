"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import clsx from "clsx";
import { Accordion } from "@mantine/core";
import { NavItem } from "../config/dashboard-nav-links";

type Props = {
  items: NavItem[];
  sideBarCollapsed?: boolean;
};

export function DashSidebarNav({ items, sideBarCollapsed }: Props) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={clsx("pb-1 border-b border-gray-600")}>
          <DashSidebarNavItems
            navItems={item}
            pathname={pathname}
            sideBarCollapsed={sideBarCollapsed}
          />
        </div>
      ))}
    </div>
  );
}

type PropsItems = {
  navItems: NavItem;
  pathname: string;
  sideBarCollapsed?: boolean;
};

export function DashSidebarNavItems({
  navItems,
  pathname,
  sideBarCollapsed,
}: PropsItems) {
  return (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {navItems.href &&
      !navItems.disabled &&
      navItems?.children?.length === 0 ? (
        <Link
          href={navItems.href}
          className={clsx(
            "group flex w-full items-center gap-2  border border-transparent   py-5 hover:text-white hover:bg-gray-600 hover:text-primary hover:underline",
            navItems.disabled &&
              "cursor-not-allowed pointer-events-none opacity-60",
            pathname === navItems.href
              ? "bg-gray-600 font-medium text-white"
              : "text-gray-200 ",
            sideBarCollapsed ? "px-3 mr-4" : "px-7"
          )}
        >
          {navItems.icon && <navItems.icon className={"h-5 w-5"} />}

          {!sideBarCollapsed && <>{navItems.title}</>}
        </Link>
      ) : navItems.href &&
        navItems.disabled &&
        navItems?.children?.length === 0 ? (
        <span
          className={clsx(
            "flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline",
            navItems.disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {navItems.title}
        </span>
      ) : (
        <div className="py-0">
          <Accordion
            variant=""
            classNames={{
              chevron: "text-gray-200",
              control: `${sideBarCollapsed ? "!px-0 !w-[63px]" : "!px-3"} `,
            }}
          >
            <Accordion.Item value={navItems?.title} className="border-none ">
              <Accordion.Control className="py-0 hover:bg-gray-600 ">
                <span
                  className={clsx(
                    "group flex w-full items-center gap-2 rounded-md border border-transparent px-3 py-2  hover:text-primary hover:underline ",
                    navItems.disabled && "cursor-not-allowed opacity-60",
                    "text-gray-200 "
                  )}
                >
                  {navItems.icon && <navItems.icon className={"h-5 w-5"} />}

                  {!sideBarCollapsed && <>{navItems.title}</>}
                </span>
              </Accordion.Control>
              <Accordion.Panel>
                {navItems?.children?.map((child, index) => (
                  <Link
                    key={index}
                    href={child.href}
                    className={clsx(
                      "group ml-6 mt-3 flex w-full items-center gap-2 rounded-md border border-transparent px-3 py-2 hover:bg-gray-600 hover:text-primary hover:underline ",
                      child.disabled &&
                        "pointer-events-none cursor-not-allowed opacity-60",
                      sideBarCollapsed && "text-xs -ml-1 !p-1 text-nowrap",
                      pathname === child.href
                        ? "bg-gray-600 font-medium text-primary"
                        : "text-gray-200 "
                    )}
                  >
                    {child.title}
                  </Link>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      )}
    </div>
  );
}
