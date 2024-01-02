"use client";

import { Blinds, ChevronLeftCircle, Menu, Stethoscope } from "lucide-react";
// import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import { DashSidebarNav } from "../../../components/sidebar-nav";
import { dashboardNav } from "../../../config/dashboard-nav-links";
import { UserNave } from "../../../components/user-nave";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sideBarCollapsed, setSideBarCollapsed] = React.useState(
    (typeof window !== "undefined" &&
      localStorage.getItem("sideBarCollapsed") === "true") ||
      false
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sideBarCollapsed", String(sideBarCollapsed));
    }
  }, [sideBarCollapsed]);
  return (
    <>
      {/* desktop menu */}
      <div className="bg-gray-800 text-gray-200">
        {/* Static sidebar for desktop */}
        <div
          className={clsx(
            sideBarCollapsed ? "lg:w-28" : "lg:w-72",
            "hidden transition-all duration-300 ease-in-out lg:fixed  lg:inset-y-0 lg:z-50 lg:flex lg:flex-col"
          )}
        >
          {/* Sidebar component */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-600  pb-4">
            <div
              className={clsx(
                !sideBarCollapsed && "pl-8",
                "flex h-[64px] shrink-0 items-center border-b border-gray-600  "
              )}
            >
              <Link href="/" className=" flex items-center space-x-2  px-6">
                <Image src={"/logo.png"} alt="logo" width={80} height={40} />
              </Link>
            </div>

            <nav className="flex flex-1 flex-col  px-6">
              <DashSidebarNav
                items={dashboardNav}
                sideBarCollapsed={sideBarCollapsed}
              />
            </nav>
          </div>
        </div>

        <div
          className={clsx(
            sideBarCollapsed ? "lg:pl-28" : "lg:pl-72",
            "transition-all duration-300 ease-in-out lg:ml-0"
          )}
        >
          <div className="sticky top-0 z-40 lg:mx-auto">
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-600 bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8  lg:shadow-none">
              {/* Mobile menu */}
              <MobileMenu />

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="relative  flex flex-1 items-center ">
                  <ChevronLeftCircle
                    className="-ml-6 hidden h-6 w-6 text-gray-400 hover:cursor-pointer lg:block"
                    onClick={() => setSideBarCollapsed(!sideBarCollapsed)}
                  />
                </div>
                <div className="flex items-center gap-x-3 ">
                  {/* Profile dropdown */}
                  <UserNave />
                </div>
              </div>
            </div>
          </div>

          <main className="min-h-[95vh] bg-primary-900">
            <div className="container mx-auto h-full px-4 sm:px-6 ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export function MobileMenu() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="block lg:hidden">
      <span
        onClick={open}
        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
      >
        <span className="sr-only">Open main menu</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </span>
      <Drawer opened={opened} onClose={close} className="w-full sm:w-[300px]">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Stethoscope className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Evently</span>
            </Link>
          </div>
          <DashSidebarNav items={dashboardNav} />
        </div>
      </Drawer>
    </div>
  );
}
