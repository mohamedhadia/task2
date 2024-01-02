"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  defaultRadius: "xs",
  components: {
    Modal: {
      styles: {
        content: { backgroundColor: "#252525", color: "#BABABA" },
      },
    },
  },
});
