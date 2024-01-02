import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import Providers from "../context/provider";

import { theme } from "../theme";
import { Roboto } from "next/font/google";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";

import "./global.css";
import { Notifications } from "@mantine/notifications";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Evently",
  description: "Evently - Demo test",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className={roboto.className}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className="bg-primary-900">
        <Providers>
          <MantineProvider theme={theme}>
            <Notifications />
            {children}
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
