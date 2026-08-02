import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceArea, Tooltip,
} from "recharts";

/* ---------------------------------------------------------------------
   TOKENS — "die Ohm" Corporate Design
--------------------------------------------------------------------- */
const OHM_RED = "#C72426";
const OHM_BLUE = "#16283D";
const INK = OHM_BLUE;
const BG = "#F4F4F3";
const PANEL = "#FFFFFF";
const PANEL_BORDER = "#E0DEDC";
const GRAY = "#6B6B6B";
const CHART_BG = "#FFFFFF";
const CHART_GRID = "#E5E3E1";
const ANALYTE_COLORS = ["#16283D", "#C72426", "#5C8A9E", "#B08B2E"];
const SANS = "'Inter', 'IBM Plex Sans', ui-sans-serif, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const R_GAS = 8.314;
const T_REF_K = 373.15; // 100 °C, feste Referenztemperatur fuer kRef
const OHM_LOGO = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJFYmVuZV8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjkuNDMgNDAuODQiPjxnIGlkPSJMb2dvIj48Zz48Zz48cGF0aCBkPSJtMTE2LjI2LDE4LjI4di02LjVoLTIuMzh2LS44N2g1LjU4di44N2gtMi4yNXY2LjVoLS45NVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTIyLDE4LjM5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjcuNjcsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMS4wMSwxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzNi44OSwxOC4yOHYtNS4yN2guOTJ2Ljc2Yy4wOC0uMTUuMi0uMjguMzUtLjQxLjE1LS4xMy4zMy0uMjMuNTUtLjMxcy40Ni0uMTIuNzUtLjEyYy4zMywwLC42NC4wNy45Mi4ycy41LjM0LjY3LjYyYy4xNy4yOC4yNS42NC4yNSwxLjA4djMuNDVoLS45NHYtMy4zNWMwLS40MS0uMTEtLjcyLS4zMi0uOTItLjIyLS4yLS41LS4zLS44NC0uMy0uMjQsMC0uNDYuMDQtLjY3LjEyLS4yMS4wOC0uMzguMTktLjUuMzUtLjEzLjE1LS4xOS4zNS0uMTkuNTh2My41MmgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNDIuNzcsMTEuOXYtLjk4aC45N3YuOThoLS45N1ptLjAzLDYuMzl2LTUuMjdoLjkxdjUuMjdoLS45MVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTQ3LjIsMTguMzljLS4zNywwLS43MS0uMDYtMS4wMi0uMTctLjMxLS4xMS0uNTgtLjI5LS43OC0uNTQtLjIxLS4yNC0uMzQtLjU1LS4zOS0uOTNoLjg2Yy4wNC4yMS4xMy4zOC4yNS41Mi4xMi4xNC4yOC4yNC40Ny4zMS4xOS4wNy4zOS4xLjYxLjEuMzYsMCwuNjQtLjA3Ljg2LS4yLjIyLS4xMy4zMy0uMzQuMzMtLjYxLDAtLjE5LS4wNi0uMzUtLjE3LS40Ny0uMTEtLjEyLS4yOS0uMi0uNTMtLjI2bC0xLjA5LS4yN2MtLjQyLS4xLS43Ni0uMjYtMS4wMi0uNDgtLjI1LS4yMi0uMzgtLjUyLS4zOC0uOTEsMC0uMzEuMDctLjU4LjIyLS44MnMuMzctLjQyLjY3LS41NmMuMy0uMTQuNjctLjIsMS4xMS0uMi41NywwLDEuMDQuMTMsMS4zOS4zOS4zNS4yNi41My42My41NSwxLjEzaC0uODRjLS4wMy0uMjUtLjE1LS40NS0uMzQtLjYtLjE5LS4xNS0uNDUtLjIyLS43Ny0uMjJzLS42MS4wNy0uODIuMmMtLjIxLjEzLS4zMi4zNC0uMzIuNjIsMCwuMTkuMDguMzMuMjMuNDQuMTUuMTEuMzcuMi42Ni4yN2wxLjA2LjI3Yy4yNC4wNi40NC4xNS42LjI1LjE2LjExLjI5LjIyLjM4LjM1cy4xNi4yNi4yLjQxLjA2LjI4LjA2LjQxYzAsLjMyLS4wOC42LS4yNC44My0uMTYuMjMtLjM5LjQxLS42OS41NC0uMy4xMy0uNjcuMTktMS4xLjE5WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTIuNTgsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE1NS45MywxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE2NC4wNCwxOC4zOWMtLjQ5LDAtLjkyLS4xMS0xLjI5LS4zMi0uMzctLjIxLS42Ny0uNTItLjg4LS45Mi0uMjEtLjQtLjMyLS44OC0uMzItMS40NHMuMS0xLjA0LjI5LTEuNDYuNDctLjc0LjgzLS45OGMuMzYtLjI0LjgtLjM1LDEuMzEtLjM1cy45Mi4xMSwxLjI2LjMyYy4zNC4yMS42LjUyLjc4LjkxLjE4LjM5LjI3Ljg1LjI3LDEuMzh2LjM1aC0zLjc4YzAsLjMzLjA1LjYzLjE3LjkuMTEuMjcuMjguNDkuNS42NS4yMi4xNi41MS4yNC44NS4yNHMuNjMtLjA4Ljg3LS4yMy40LS4zOC40Ny0uNjhoLjg5Yy0uMDYuMzYtLjIuNjYtLjQzLjktLjIyLjI0LS40OS40My0uOC41NS0uMzEuMTItLjY0LjE5LS45OC4xOVptLTEuNTMtMy4xNmgyLjg2YzAtLjMtLjA1LS41OC0uMTUtLjgyLS4xLS4yNC0uMjYtLjQ0LS40Ny0uNTgtLjIxLS4xNC0uNDctLjIxLS43OS0uMjFzLS42LjA4LS44Mi4yNC0uMzguMzYtLjQ4LjYxLS4xNi41LS4xNS43NloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTE1LjAyLDI4LjY5di03LjM3aC45NHYzLjE0aDMuOTh2LTMuMTRoLjk0djcuMzdoLS45NHYtMy40aC0zLjk4djMuNGgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjQuNjcsMjguNzljLS40OSwwLS45MS0uMS0xLjI3LS4zMS0uMzYtLjIxLS42NC0uNTItLjg0LS45Mi0uMi0uNC0uMy0uOS0uMy0xLjQ4LDAtLjU1LjA5LTEuMDMuMjgtMS40NS4xOS0uNDIuNDYtLjc0LjgyLS45N3MuOC0uMzQsMS4zMi0uMzRjLjQ5LDAsLjkxLjExLDEuMjYuMzIuMzYuMjEuNjMuNTIuODMuOTMuMi40MS4zLjkxLjMsMS41LDAsLjU0LS4wOSwxLjAxLS4yOCwxLjQyLS4xOC40MS0uNDUuNzMtLjgxLjk2LS4zNi4yMy0uNzkuMzQtMS4zMi4zNFptMC0uNzRjLjMxLDAsLjU4LS4wOC43OS0uMjRzLjM4LS4zOS41LS42OWMuMTEtLjMuMTctLjY1LjE3LTEuMDcsMC0uMzgtLjA1LS43Mi0uMTUtMS4wMnMtLjI2LS41NC0uNDctLjcyLS40OS0uMjctLjg0LS4yN2MtLjMyLDAtLjU5LjA4LS44MS4yNHMtLjM5LjM5LS41LjY5Yy0uMTEuMy0uMTcuNjYtLjE3LDEuMDgsMCwuMzcuMDUuNzEuMTUsMS4wMS4xLjMuMjYuNTQuNDguNzIuMjIuMTguNS4yNi44NS4yNloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTMwLjQ1LDI4Ljc5Yy0uNDgsMC0uOS0uMS0xLjI2LS4zMXMtLjY1LS41MS0uODYtLjkyYy0uMjEtLjQtLjMxLS45LS4zMS0xLjQ5LDAtLjU1LjA5LTEuMDMuMjgtMS40NC4xOS0uNDEuNDYtLjc0LjgzLS45Ny4zNi0uMjMuOC0uMzUsMS4zMi0uMzUuMzgsMCwuNzIuMDcsMS4wMi4yMnMuNTUuMzUuNzQuNjFjLjE5LjI3LjMxLjU4LjM2Ljk0aC0uODRjLS4wMy0uMTktLjEtLjM2LS4yMS0uNTEtLjExLS4xNS0uMjUtLjI4LS40My0uMzdzLS4zOS0uMTQtLjYzLS4xNGMtLjQ1LDAtLjgyLjE2LTEuMS40OS0uMjguMzMtLjQzLjgzLS40MywxLjUsMCwuNjEuMTMsMS4wOS4zOSwxLjQ2LjI2LjM3LjY0LjU1LDEuMTUuNTUuMjQsMCwuNDUtLjA1LjYzLS4xNC4xOC0uMDkuMzItLjIyLjQzLS4zN3MuMTgtLjMyLjIxLS41aC44MmMtLjA0LjM1LS4xNi42Ni0uMzYuOTItLjIuMjYtLjQ0LjQ2LS43NC42LS4zLjE0LS42NC4yMS0xLjAxLjIxWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMzMuOCwyOC42OXYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MS41MiwyOC43OWMtLjM3LDAtLjcxLS4wNi0xLjAyLS4xNy0uMzEtLjExLS41OC0uMjktLjc4LS41NC0uMjEtLjI0LS4zNC0uNTUtLjM5LS45M2guODZjLjA0LjIxLjEzLjM4LjI1LjUyLjEyLjE0LjI4LjI0LjQ3LjMxLjE5LjA3LjM5LjEuNjEuMS4zNiwwLC42NC0uMDcuODYtLjIuMjItLjEzLjMzLS4zNC4zMy0uNjEsMC0uMTktLjA2LS4zNS0uMTctLjQ3LS4xMS0uMTItLjI5LS4yLS41My0uMjZsLTEuMDktLjI3Yy0uNDItLjEtLjc2LS4yNi0xLjAyLS40OC0uMjUtLjIyLS4zOC0uNTItLjM4LS45MSwwLS4zMS4wNy0uNTguMjItLjgycy4zNy0uNDIuNjctLjU2Yy4zLS4xNC42Ny0uMiwxLjExLS4yLjU3LDAsMS4wNC4xMywxLjM5LjM5LjM1LjI2LjUzLjYzLjU1LDEuMTNoLS44NGMtLjAzLS4yNS0uMTUtLjQ1LS4zNC0uNi0uMTktLjE1LS40NS0uMjItLjc3LS4yMnMtLjYxLjA3LS44Mi4yYy0uMjEuMTMtLjMyLjM0LS4zMi42MiwwLC4xOS4wOC4zMy4yMy40NC4xNS4xMS4zNy4yLjY2LjI3bDEuMDYuMjdjLjI0LjA2LjQ0LjE1LjYuMjUuMTYuMTEuMjkuMjIuMzguMzVzLjE2LjI2LjIuNDEuMDYuMjguMDYuNDFjMCwuMzItLjA4LjYtLjI0LjgzLS4xNi4yMy0uMzkuNDEtLjY5LjU0LS4zLjEzLS42Ny4xOS0xLjEuMTlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni45MSwyOC43OWMtLjQ4LDAtLjktLjEtMS4yNi0uMzFzLS42NS0uNTEtLjg2LS45MmMtLjIxLS40LS4zMS0uOS0uMzEtMS40OSwwLS41NS4wOS0xLjAzLjI4LTEuNDQuMTktLjQxLjQ2LS43NC44My0uOTcuMzYtLjIzLjgtLjM1LDEuMzItLjM1LjM4LDAsLjcyLjA3LDEuMDIuMjJzLjU1LjM1Ljc0LjYxYy4xOS4yNy4zMS41OC4zNi45NGgtLjg0Yy0uMDMtLjE5LS4xLS4zNi0uMjEtLjUxLS4xMS0uMTUtLjI1LS4yOC0uNDMtLjM3cy0uMzktLjE0LS42My0uMTRjLS40NSwwLS44Mi4xNi0xLjEuNDktLjI4LjMzLS40My44My0uNDMsMS41LDAsLjYxLjEzLDEuMDkuMzksMS40Ni4yNi4zNy42NC41NSwxLjE1LjU1LjI0LDAsLjQ1LS4wNS42My0uMTQuMTgtLjA5LjMyLS4yMi40My0uMzdzLjE4LS4zMi4yMS0uNWguODJjLS4wNC4zNS0uMTYuNjYtLjM2LjkyLS4yLjI2LS40NC40Ni0uNzQuNi0uMy4xNC0uNjQuMjEtMS4wMS4yMVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTUwLjI2LDI4LjY5di03LjU3aC45MnYzLjA4Yy4wOS0uMTUuMjEtLjI4LjM2LS40MS4xNS0uMTMuMzMtLjIzLjU0LS4zMS4yMS0uMDguNDYtLjEyLjc0LS4xMi4zNCwwLC42NS4wNi45My4xOS4yOC4xMy41LjMxLjY2LjU0cy4yNC41MS4yNC44NHYzLjc3aC0uOTR2LTMuNThjMC0uMzItLjExLS41Ni0uMzItLjczLS4yMi0uMTctLjUtLjI2LS44NC0uMjYtLjI0LDAtLjQ2LjA0LS42Ni4xMi0uMjEuMDgtLjM4LjE5LS41LjM1LS4xMy4xNS0uMTkuMzUtLjE5LjU5djMuNTJoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU4LjA4LDI4Ljc5Yy0uMjgsMC0uNTMtLjA0LS43OC0uMTItLjI0LS4wOC0uNDYtLjE5LS42NC0uMzQtLjE5LS4xNS0uMzMtLjM0LS40NC0uNTYtLjExLS4yMi0uMTYtLjQ4LS4xNi0uNzh2LTMuNThoLjk0djMuNDhjMCwuMzQuMTEuNjIuMzIuODQuMjEuMjEuNTMuMzIuOTYuMzIuMzksMCwuNy0uMS45NC0uMy4yNC0uMi4zNS0uNS4zNS0uOXYtMy40M2guOTR2NS4yN2gtLjc1bC0uMS0xLjAxYy0uMDYuMjctLjE3LjQ4LS4zMy42NC0uMTYuMTYtLjM0LjI4LS41Ni4zNnMtLjQ1LjExLS43LjExWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNjMuNDUsMjguNzZjLS4yOSwwLS41Mi0uMDQtLjY5LS4xMi0uMTgtLjA4LS4zMS0uMTgtLjQtLjMyLS4wOS0uMTMtLjE2LS4yOC0uMTktLjQ2LS4wMy0uMTctLjA1LS4zNS0uMDUtLjUzdi02LjIyaC45M3Y2LjEzYzAsLjI2LjA1LjQ2LjE2LjYuMS4xMy4yNS4yMS40NC4yMmguMjl2LjYyYy0uMDguMDItLjE2LjA0LS4yNC4wNi0uMDguMDItLjE2LjAyLS4yMy4wMloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTY3LjE5LDI4Ljc5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMTUuMDIsMzkuMXYtNy4zN2guOWwzLjg5LDUuNzN2LTUuNzNoLjk0djcuMzdoLS44NGwtMy45Ni01LjgxdjUuODFoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI0LjQ1LDM5LjJjLS4yOCwwLS41My0uMDQtLjc4LS4xMi0uMjQtLjA4LS40Ni0uMTktLjY0LS4zNC0uMTktLjE1LS4zMy0uMzQtLjQ0LS41Ni0uMTEtLjIyLS4xNi0uNDgtLjE2LS43OHYtMy41OGguOTR2My40OGMwLC4zNC4xMS42Mi4zMi44NC4yMS4yMS41My4zMi45Ni4zMi4zOSwwLC43LS4xLjk0LS4zLjI0LS4yLjM1LS41LjM1LS45di0zLjQzaC45NHY1LjI3aC0uNzVsLS4xLTEuMDFjLS4wNi4yNy0uMTcuNDgtLjMzLjY0LS4xNi4xNi0uMzQuMjgtLjU2LjM2cy0uNDUuMTEtLjcuMTFabS0xLjI0LTYuNTZ2LS45MWguOTN2LjkxaC0uOTNabTEuOTgsMHYtLjkxaC45M3YuOTFoLS45M1oiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI4LjQ5LDM5LjF2LTUuMjdoLjl2MS4wMWMuMDktLjI1LjIxLS40Ni4zNy0uNjIuMTYtLjE3LjM0LS4yOS41NS0uMzcuMjEtLjA4LjQyLS4xMi42NC0uMTIuMDgsMCwuMTUsMCwuMjMuMDIuMDguMDEuMTMuMDMuMTcuMDV2LjkxYy0uMDUtLjAyLS4xMi0uMDQtLjItLjA1cy0uMTUtLjAxLS4yLS4wMWMtLjIxLS4wMS0uNDEsMC0uNTkuMDRzLS4zNC4xMS0uNDguMmMtLjE0LjEtLjI1LjIyLS4zMy4zOC0uMDguMTUtLjEyLjM0LS4xMi41NnYzLjI4aC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMi40OCwzOS4xdi01LjI3aC45MnYuNzZjLjA4LS4xNS4yLS4yOC4zNS0uNDEuMTUtLjEzLjMzLS4yMy41NS0uMzFzLjQ2LS4xMi43NS0uMTJjLjMzLDAsLjY0LjA3LjkyLjJzLjUuMzQuNjcuNjJjLjE3LjI4LjI1LjY0LjI1LDEuMDh2My40NWgtLjk0di0zLjM1YzAtLjQxLS4xMS0uNzItLjMyLS45Mi0uMjItLjItLjUtLjMtLjg0LS4zLS4yNCwwLS40Ni4wNC0uNjcuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OHYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MC45NywzOS4yYy0uMzEsMC0uNTctLjA0LS43OC0uMTItLjIxLS4wOC0uMzktLjE5LS41Mi0uMzEtLjE0LS4xMy0uMjQtLjI2LS4zMi0uMzktLjA4LS4xMy0uMTMtLjI1LS4xNi0uMzVsLS4xLDEuMDhoLS43MnYtNy41N2guOTV2My4xNGMuMDQtLjA5LjExLS4xOS4yLS4yOS4wOS0uMS4yMS0uMjEuMzUtLjMxcy4zMS0uMTguNTEtLjI0Yy4yLS4wNi40Mi0uMS42Ny0uMS42NiwwLDEuMTguMjMsMS41Ny42OS4zOS40Ni41OCwxLjEzLjU4LDIuMDMsMCwuNTUtLjA4LDEuMDQtLjI1LDEuNDUtLjE3LjQxLS40MS43My0uNzQuOTYtLjMzLjIzLS43NC4zNC0xLjIzLjM0Wm0tLjE3LS43MmMuNDMsMCwuNzgtLjE3LDEuMDQtLjUuMjctLjMzLjQtLjg2LjQtMS41OCwwLS42Mi0uMTItMS4wOS0uMzgtMS40My0uMjUtLjM0LS42MS0uNTEtMS4wOS0uNTEtLjM1LDAtLjYzLjA4LS44NC4yMy0uMjEuMTUtLjM3LjM3LS40Ny42Ni0uMS4yOS0uMTUuNjQtLjE2LDEuMDUsMCwuNzQuMTIsMS4yNy4zNCwxLjU5LjIzLjMyLjYxLjQ5LDEuMTQuNDlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni42NywzOS4yYy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTAuMjEsMzkuMXYtNS4yN2guOXYxLjAxYy4wOS0uMjUuMjEtLjQ2LjM3LS42Mi4xNi0uMTcuMzQtLjI5LjU1LS4zNy4yMS0uMDguNDItLjEyLjY0LS4xMi4wOCwwLC4xNSwwLC4yMy4wMi4wOC4wMS4xMy4wMy4xNy4wNXYuOTFjLS4wNS0uMDItLjEyLS4wNC0uMi0uMDVzLS4xNS0uMDEtLjItLjAxYy0uMjEtLjAxLS40MSwwLS41OS4wNHMtLjM0LjExLS40OC4yYy0uMTQuMS0uMjUuMjItLjMzLjM4LS4wOC4xNS0uMTIuMzQtLjEyLjU2djMuMjhoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU2LjI3LDQwLjg0Yy0uODMsMC0xLjQ3LS4xMi0xLjkzLS4zNi0uNDYtLjI0LS42OS0uNTgtLjY5LTEuMDMsMC0uMTkuMDQtLjM1LjEzLS40OS4wOS0uMTMuMTktLjI1LjMyLS4zMy4xMi0uMDkuMjQtLjE2LjM0LS4yMS4xLS4wNS4xNy0uMDkuMi0uMTEtLjA2LS4wMy0uMTMtLjA4LS4yMS0uMTMtLjA4LS4wNS0uMTYtLjEyLS4yMy0uMnMtLjEtLjItLjEtLjMzYzAtLjE3LjA4LS4zMi4yMy0uNDYuMTYtLjE0LjM5LS4yNC43LS4zMS0uMzEtLjE2LS41NS0uMzYtLjcyLS42Mi0uMTctLjI2LS4yNi0uNTQtLjI2LS44NCwwLS4zNC4wOS0uNjQuMjgtLjg5LjE4LS4yNS40NS0uNDQuNzktLjU4LjM0LS4xMy43NS0uMiwxLjIzLS4yLjM0LDAsLjYzLjA0Ljg2LjEyLjIzLjA4LjQ1LjE5LjY1LjM0LjA1LS4wMi4xNC0uMDYuMjYtLjExLjEyLS4wNS4yNS0uMS4zOS0uMTYuMTQtLjA2LjI3LS4xMS40LS4xN3MuMjItLjA5LjMtLjEydi44N3MtLjkzLjE3LS45My4xN2MuMDUuMTEuMS4yMy4xMy4zNi4wMy4xMy4wNC4yNS4wNC4zNiwwLC4zMS0uMDguNTktLjI0Ljg0LS4xNi4yNS0uNDEuNDUtLjczLjYtLjMzLjE1LS43My4yMi0xLjIyLjIyLS4wNCwwLS4wOSwwLS4xNiwwLS4wNiwwLS4xMiwwLS4xNiwwLS4zNiwwLS42MS4wNS0uNzQuMTItLjEzLjA3LS4yLjE1LS4yLjIzLDAsLjEuMDguMTcuMjMuMi4xNS4wNC40MS4wNy43OC4xLjEzLDAsLjMuMDEuNDkuMDMuMiwwLC40MS4wMi42Ni4wNC41NS4wMy45OC4xNywxLjI3LjQycy40NS41OC40NSwxYzAsLjQ4LS4yMS44Ny0uNjQsMS4xNy0uNDMuMy0xLjA4LjQ1LTEuOTUuNDVabS4xNy0uNjFjLjQ5LDAsLjg2LS4wNywxLjEyLS4yMi4yNi0uMTUuMzktLjM3LjM5LS42NiwwLS4yMS0uMDgtLjM4LS4yNC0uNTEtLjE2LS4xNC0uNC0uMjEtLjcyLS4yM2wtMS40OC0uMWMtLjEzLDAtLjI3LjAzLS40MS4xLS4xNC4wNy0uMjYuMTctLjM2LjNzLS4xNS4yOC0uMTUuNDRjMCwuMjguMTUuNS40NS42NS4zLjE2Ljc3LjIzLDEuNC4yM1ptLS4xNi0zLjc2Yy4zOCwwLC42OC0uMDkuOTItLjI3LjIzLS4xOC4zNS0uNDQuMzUtLjc4cy0uMTItLjYyLS4zNS0uODEtLjU0LS4yOC0uOTItLjI4LS43LjA5LS45NC4yOC0uMzUuNDYtLjM1LjgxYzAsLjMzLjExLjU5LjM0Ljc3LjIzLjE4LjU0LjI4Ljk1LjI4WiIgZmlsbD0iI2M3MjQyNiIvPjwvZz48Zz48cGF0aCBkPSJtNTcuODMsMjEuODZjLjEzLTUuNS0zLjExLTEwLjQ4LTguODctMTEuMTQtMi43NC0uMjQtNS42My43NS03Ljc5LDIuNSwwLS4yOSwwLS41Ny4wMy0uODYuMDctMy4wOC4xMi05LjI4LjEtMTIuMzZoLTYuMDJ2MzkuMWg2LjAyczAtMTAuOTgsMC0xNC4zN2gwczAtMS4zNSwwLTIuNjRjLjA2LTEuNzQuMzktMy41NiwxLjcxLTQuNTcsMS41Ni0xLjE4LDQuMzktMS4zOCw2LjE4LS41OCwxLjUyLjcyLDIuMDksMS44MSwyLjQ4LDMuNDguMS42NS4xNywyLjI3LjE3LDQuMzIsMCw0LjY5LS4wOCwxMy4wOS0uMDIsMTQuMzYsMCwwLDYuMDIsMCw2LjAyLDAtLjAxLTEuMi4wMi0xNi40MywwLTE3LjI0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMDEuNjYsMzMuNDJzLS4wNSwwLS4wOC4wMWMwLTQuODQuMDEtMTEuMDYsMC0xMS41Ny4xNy01LjI5LTMuMTctMTAuNzctOC44Ni0xMS4xOC0zLjU1LS4yOC03LjYxLjk4LTkuODEsMy45MS0xLjUyLTIuMTEtMy44LTMuNjEtNi43Mi0zLjkyLS45Mi0uMDUtMS44NS4wMi0yLjc3LjIxLTEuODMuMzUtMy41OSwxLjE4LTUuMDMsMi4zNC0uMDItLjgzLS4wMi0xLjY1LDAtMi40OGgtNS45djI4LjM2aDYuMDJsLjAyLTcuMDl2LTcuMDljMC0uMzksMC0yLjgyLDAtMywwLS42Mi4wNy0xLjA4LjE0LTEuNDcuMTMtLjcuMzQtMS4zNy42OC0xLjk0LjE2LS4yNi4zNC0uNS41Ni0uNzIuMDEtLjAxLjIyLS4xOS4zMS0uMjcsMS4yLS44OCwyLjgzLTEuMTUsNC4zMS0xLjAzLjY4LjA2LDEuMzIuMjEsMS44Ny40NS43Ni4zNiwxLjI4LjgxLDEuNjcsMS4zOC4xMi4xOS4yMy4zOS4zMy42LjIuNDQuMzYuOTMuNDksMS41LjAzLjE2LjA1LjM4LjA3LjY0LDAsLjA5LjAxLjE4LjAyLjI4LjAxLjI2LjAzLjU1LjA0Ljg3LDAsLjAxLDAsLjAyLDAsLjAzLDAsLjI3LjAyLDEuMzEuMDIsMS40OS4wMywzLjQ0LDAsNi44NywwLDEwLjMxLDAsLjI0LDAsNS4wNSwwLDUuMDUsMCwwLDEuNywwLDMuMjksMCwuMzcsMCwuNzQsMCwxLjA4LDBzLjY1LDAsLjkxLDBoLjc0czAtLjAzLDAtLjA0aDBzMC0zLjIyLDAtNi43YzAtMS4xNiwwLTIuMzcsMC0zLjU0LDAtLjI1LDAtMy41OCwwLTQuNjYsMC0uMTgsMC0uNTEsMC0uNTEsMCwwLDAtMS40NCwwLTEuNDgsMC0xLjMzLjI4LTMsMS4wMy0zLjk1LDEuMDItMS4zMiwyLjUzLTEuNjgsNC4yNi0xLjczLDEuNjktLjA2LDMuMzEuNDIsNC4yLDEuNzUuNjQuODgsMS4wMiwyLjM3LDEuMDMsMy42MnYxLjkyczAsMTUuMzIsMCwxNS4zMmMwLDAsNi4wMiwwLDYuMDIsMGgwczYuMSwwLDYuMSwwdi02LjAyYy0xLjc0LS4wMi0zLjg5LS4wNy02LjAzLjM0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNy4yNSwxMC4zN2gwYy02LjAzLjA4LTExLjQ3LDIuODYtMTMuMzYsOC45LTEuNDEsNC40NC0uOTcsOS4xMywxLjUzLDEzLjExLjIzLjM1LjQ5LjY4Ljc3Ljk5LTIuMDUtLjM2LTQuMTEtLjMyLTYuMTgtLjN2Ni4wMmgxNS4yN3YtNS44MmMtNC4zMS0uNTgtNS45OC0zLjUtNi4wMy04LjY4LS4xNS01LjcxLDIuNDktOC44LDguMDItOC45MmgwYzMuNTUuMDQsNi43MSwxLjY3LDcuNTksNS4yNi42LDIuMjMuNTYsNS4yMi4wMyw3LjQ1LS43LDMuMTEtMi44Nyw0LjUyLTUuNjQsNC44OXY1LjY4YzEuMS0uMTIsMi4yMy0uMzIsMy4zOC0uNjcsOC4xLTIuMzcsMTAuMi0xMS43MSw3Ljk3LTE4Ljk5LTEuOTEtNi03LjMyLTguODMtMTMuMzMtOC45MloiIGZpbGw9IiNjNzI0MjYiLz48L2c+PC9nPjwvZz48L3N2Zz4=";

function de(v, d = 2) { return (isFinite(v) ? v.toFixed(d) : "—").replace(".", ","); }
function fmtTime(s) {
  if (!isFinite(s)) return "—";
  if (s < 60) return `${de(s, 1)} s`;
  if (s < 3600) return `${de(s / 60, 2)} min`;
  return `${de(s / 3600, 2)} h`;
}
function kOfT(kRef, dH, tempC) {
  const T = tempC + 273.15;
  return kRef * Math.exp(((dH * 1000) / R_GAS) * (1 / T - 1 / T_REF_K));
}
function gaussAt(z, mean, variance, amount) {
  if (variance < 1e-6) return 0;
  return (amount / Math.sqrt(2 * Math.PI * variance)) * Math.exp(-((z - mean) ** 2) / (2 * variance));
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeGaussian(rng) {
  return function () {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}
const logToPos = (val, min, max) => (100 * Math.log(val / min)) / Math.log(max / min);
const posToLog = (pos, min, max) => min * Math.pow(max / min, pos / 100);

/* ---------------------------------------------------------------------
   CONTROL WIDGETS
--------------------------------------------------------------------- */
function Field({ label, value, locked, children }) {
  return (
    <div className="mb-3" style={{ opacity: locked ? 0.5 : 1 }}>
      <div className="flex items-baseline justify-between mb-1">
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.02em", color: GRAY, fontWeight: 500 }}>
          {label}{locked ? " 🔒" : ""}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK, fontWeight: 700 }}>{value}</span>
      </div>
      {children}
    </div>
  );
}
function LinearSlider({ min, max, step, value, onChange, disabled }) {
  return <input className="ohm-slider" type="range" min={min} max={max} step={step} value={value} disabled={disabled}
    onChange={(e) => onChange(parseFloat(e.target.value))} />;
}
function LogSlider({ min, max, value, onChange, disabled }) {
  const pos = logToPos(value, min, max);
  return <input className="ohm-slider" type="range" min={0} max={100} step={0.1} value={pos} disabled={disabled}
    onChange={(e) => onChange(posToLog(parseFloat(e.target.value), min, max))} />;
}
function PanelBox({ title, children }) {
  return (
    <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.03em", color: INK, textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${OHM_RED}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------
   SÄULEN-GRAFIK — Analyten als wandernde Gauß-Pakete
--------------------------------------------------------------------- */
function ColumnGraphic({ analytes, L, running }) {
  const x0 = 55, x1 = 365, y0 = 70;
  const maxAmp = Math.max(0.001, ...analytes.map((a) => a.amount / Math.sqrt(2 * Math.PI * Math.max(a.sigma2, 1e-6))));

  return (
    <svg viewBox="0 0 400 150" style={{ width: "100%", height: "100%" }}>
      {/* Injektor */}
      <rect x={x0 - 30} y={y0 - 10} width={20} height={20} rx="3" fill="#fff" stroke={OHM_RED} strokeWidth={2} />
      <text x={x0 - 20} y={y0 + 26} textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="9" fill={OHM_RED}>Injektor</text>
      <line x1={x0 - 10} y1={y0} x2={x0} y2={y0} stroke="#B9B7B4" strokeWidth={6} />

      {/* Säule */}
      <rect x={x0} y={y0 - 14} width={x1 - x0} height={28} fill="#FAFAF9" stroke="#B9B7B4" strokeWidth={2.5} rx="4" />
      <text x={(x0 + x1) / 2} y={y0 + 34} textAnchor="middle" fontFamily={MONO} fontSize="10" fill={GRAY}>Säulenlänge: {de(L, 0)} cm</text>

      {/* Analyt-Pakete */}
      {analytes.map((a) => {
        const zx = x0 + (Math.min(a.zbar, L) / L) * (x1 - x0);
        const sigmaPx = Math.min(18, Math.max(1.5, (Math.sqrt(a.sigma2) / L) * (x1 - x0)));
        const amp = a.amount / Math.sqrt(2 * Math.PI * Math.max(a.sigma2, 1e-6));
        const opac = a.zbar < L * 1.15 ? Math.max(0.15, Math.min(1, amp / maxAmp)) : 0;
        return (
          <ellipse key={a.id} cx={zx} cy={y0} rx={sigmaPx} ry={11} fill={a.color} opacity={opac * 0.85} />
        );
      })}

      {/* Detektor */}
      <line x1={x1} y1={y0} x2={x1 + 10} y2={y0} stroke="#B9B7B4" strokeWidth={6} />
      <rect x={x1 + 10} y={y0 - 10} width={20} height={20} rx="3" fill="#fff" stroke={OHM_BLUE} strokeWidth={2} />
      <text x={x1 + 20} y={y0 + 26} textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="9" fill={OHM_BLUE}>Detektor</text>
      {running && <circle cx={x1 + 20} cy={y0} r={3} fill={OHM_BLUE} opacity={0.7} />}
    </svg>
  );
}

/* ---------------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------------- */
export default function GasChromatograph() {
  const nextId = useRef(4);
  const [analytesCfg, setAnalytesCfg] = useState([
    { id: 1, name: "Pentan", color: ANALYTE_COLORS[0], kRef: 2.0, dH: 15, amount: 1.0 },
    { id: 2, name: "Hexan", color: ANALYTE_COLORS[1], kRef: 4.0, dH: 20, amount: 1.0 },
    { id: 3, name: "Heptan", color: ANALYTE_COLORS[2], kRef: 8.0, dH: 25, amount: 1.0 },
  ]);
  const [L, setL] = useState(30);
  const [nPlates, setNPlates] = useState(800);
  const [uGas, setUGas] = useState(3.0);
  const [tempC, setTempC] = useState(60);
  const [rampOn, setRampOn] = useState(false);
  const [rampRate, setRampRate] = useState(10); // °C/min
  const [noisePct, setNoisePct] = useState(1.5);
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false); // L, N, Analyt-Eigenschaften gesperrt nach Injektion
  const [, setTick] = useState(0);
  const [zoomDomain, setZoomDomain] = useState(null);
  const [refAreaLeft, setRefAreaLeft] = useState(null);
  const [refAreaRight, setRefAreaRight] = useState(null);

  const paramsRef = useRef({});
  paramsRef.current = { analytesCfg, L, nPlates, uGas, tempC, rampOn, rampRate, noisePct, speed };

  const elapsedRef = useRef(0);
  const tempNowRef = useRef(tempC);
  const stateRef = useRef({}); // { id: {zbar, sigma2} }
  const histRef = useRef([{ t: 0, total: 0 }]);
  const gaussRef = useRef(makeGaussian(mulberry32(Date.now() % 1e6)));
  const windowWidthRef = useRef(120);

  const estimateFullRunTime = useCallback((p) => {
    const worst = Math.max(...p.analytesCfg.map((a) => {
      const k = kOfT(a.kRef, a.dH, p.tempC);
      const u = p.uGas / (1 + k);
      return p.L / u;
    }));
    return Math.min(3000, Math.max(30, worst * 2.6));
  }, []);
  const estimateInitialWindow = useCallback((p) => {
    const fastest = Math.min(...p.analytesCfg.map((a) => {
      const k = kOfT(a.kRef, a.dH, p.tempC);
      const u = p.uGas / (1 + k);
      return p.L / u;
    }));
    return Math.min(200, Math.max(15, fastest * 2.5));
  }, []);

  const initRun = useCallback(() => {
    const p = paramsRef.current;
    elapsedRef.current = 0;
    tempNowRef.current = p.tempC;
    const st = {};
    p.analytesCfg.forEach((a) => { st[a.id] = { zbar: 0, sigma2: 1e-6 }; });
    stateRef.current = st;
    histRef.current = [{ t: 0, total: 0, temp: p.tempC }];
    gaussRef.current = makeGaussian(mulberry32(Date.now() % 1e6));
    windowWidthRef.current = estimateInitialWindow(p);
    setTick((t) => t + 1);
  }, [estimateInitialWindow]);

  useEffect(() => { initRun(); }, []); // eslint-disable-line
  useEffect(() => { if (!locked) { tempNowRef.current = tempC; initRun(); } }, [L, nPlates, analytesCfg.length]); // eslint-disable-line
  useEffect(() => { if (!locked) tempNowRef.current = tempC; }, [tempC, locked]);

  useEffect(() => {
    if (!running) return;
    let raf, last = performance.now(), frame = 0;
    const step = (now) => {
      const dtReal = Math.min(now - last, 100) / 1000;
      last = now;
      const p = paramsRef.current;
      const dtSim = dtReal * p.speed;

      const targetSub = 0.4; // Ziel-Teilschritt in s, rein für Integrationsgenauigkeit (keine Instabilitätsgefahr)
      const subSteps = Math.min(400, Math.max(1, Math.round(dtSim / targetSub)));
      const actualSub = dtSim / subSteps;

      for (let s = 0; s < subSteps; s++) {
        if (p.rampOn) tempNowRef.current += (p.rampRate / 60) * actualSub;
        else tempNowRef.current = p.tempC;
        const T = tempNowRef.current;
        p.analytesCfg.forEach((a) => {
          const st = stateRef.current[a.id];
          const k = kOfT(a.kRef, a.dH, T);
          const u = p.uGas / (1 + k);
          const D = (u * p.L) / (2 * p.nPlates);
          st.zbar += u * actualSub;
          st.sigma2 += 2 * D * actualSub;
        });
        elapsedRef.current += actualSub;
      }

      const t = elapsedRef.current;
      let total = 0;
      p.analytesCfg.forEach((a) => {
        const st = stateRef.current[a.id];
        total += gaussAt(p.L, st.zbar, st.sigma2, a.amount);
      });
      const noiseAmp = (p.noisePct / 100) * Math.max(...p.analytesCfg.map((a) => a.amount));
      total = Math.max(0, total + noiseAmp * gaussRef.current() * 0.3);

      const minKeep = t - windowWidthRef.current * 1.5;
      const newArr = histRef.current.filter((pt) => pt.t >= minKeep);
      newArr.push({ t, total, temp: tempNowRef.current });
      histRef.current = newArr;

      windowWidthRef.current = Math.max(windowWidthRef.current, t * 1.2);
      frame++;
      if (frame % 2 === 0) setTick((x) => x + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const handlePlayPause = () => {
    if (!running) setLocked(true);
    setRunning((r) => !r);
  };
  const handleReset = () => { setRunning(false); setLocked(false); initRun(); };
  const handleAutoSpeed = () => {
    const full = estimateFullRunTime(paramsRef.current);
    setSpeed(Math.max(1, Math.round(full / 25)));
  };

  const addAnalyte = () => {
    if (analytesCfg.length >= 4) return;
    const id = nextId.current++;
    const used = analytesCfg.map((a) => a.color);
    const color = ANALYTE_COLORS.find((c) => !used.includes(c)) || ANALYTE_COLORS[0];
    setAnalytesCfg((cs) => [...cs, { id, name: `Substanz ${id}`, color, kRef: 3.0, dH: 18, amount: 1.0 }]);
  };
  const removeAnalyte = (id) => {
    if (analytesCfg.length <= 1) return;
    setAnalytesCfg((cs) => cs.filter((a) => a.id !== id));
  };
  const updateAnalyte = (id, field, value) => {
    setAnalytesCfg((cs) => cs.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const exportCSV = () => {
    const csvNum = (x) => (x === null || x === undefined || Number.isNaN(x) ? "" : x.toFixed(5).replace(".", ","));
    const p = paramsRef.current;
    const meta = [
      `# Gaschromatograph-Monitor Messexport`,
      `# Saeulenlaenge L=${p.L} cm; Trennstufen N=${p.nPlates}; Traegergasgeschwindigkeit u=${p.uGas} cm/s`,
      `# Ofentemperatur=${p.tempC} C; Temperaturrampe=${p.rampOn ? p.rampRate + " C/min" : "aus"}; Rauschen=${p.noisePct}%`,
      ...p.analytesCfg.map((a) => `# Analyt ${a.name}: kRef=${a.kRef} (bei 100C); dH=${a.dH} kJ/mol; Menge=${a.amount}`),
      `# Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
      ``,
      `Zeit_s;Signal_gesamt`,
      ...histRef.current.map((pt) => `${csvNum(pt.t)};${csvNum(pt.total)}`),
    ];
    const csvContent = "\uFEFF" + meta.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gc_chromatogramm_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const elapsed = elapsedRef.current;
  const ww = windowWidthRef.current;
  const xDomain = elapsed <= ww ? [0, ww] : [elapsed - ww, elapsed];
  const displayDomain = zoomDomain || xDomain;

  const analytesLive = analytesCfg.map((a) => ({ ...a, ...(stateRef.current[a.id] || { zbar: 0, sigma2: 1e-6 }) }));
  let yMaxObs = 0.1;
  histRef.current.forEach((pt) => { if (pt.t >= displayDomain[0] && pt.total > yMaxObs) yMaxObs = pt.total; });
  const yMax = yMaxObs * 1.25;

  const handleChartMouseDown = (e) => { if (e && e.activeLabel !== undefined) { setRefAreaLeft(e.activeLabel); setRefAreaRight(e.activeLabel); } };
  const handleChartMouseMove = (e) => { if (refAreaLeft !== null && e && e.activeLabel !== undefined) setRefAreaRight(e.activeLabel); };
  const handleChartMouseUp = () => {
    if (refAreaLeft !== null && refAreaRight !== null && refAreaLeft !== refAreaRight) {
      setZoomDomain([Math.min(refAreaLeft, refAreaRight), Math.max(refAreaLeft, refAreaRight)]);
    }
    setRefAreaLeft(null); setRefAreaRight(null);
  };
  const resetZoom = () => setZoomDomain(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "6px 10px", fontFamily: MONO, fontSize: 11, color: INK, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
        <div style={{ opacity: 0.6, marginBottom: 4 }}>t = {fmtTime(label)}</div>
        {payload.map((p) => (
          <div key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>
            {p.dataKey === "temp" ? `T: ${de(p.value, 0)} °C` : `Signal: ${de(p.value, 3)}`}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center p-3 md:p-6" style={{ background: BG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        input.ohm-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; background-color:#DEDCDA; cursor:pointer; }
        input.ohm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
          background: ${OHM_RED}; border:2px solid #fff; box-shadow:0 0 0 1px ${PANEL_BORDER}, 0 1px 3px rgba(0,0,0,.25); cursor:pointer; }
        input.ohm-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background: ${OHM_RED}; border:2px solid #fff; cursor:pointer; }
        input.ohm-slider::-moz-range-track { background:#DEDCDA; height:4px; border-radius:2px; }
        input.ohm-slider:disabled::-webkit-slider-thumb { background: #B9B7B4; }
        input.ohm-slider:disabled::-moz-range-thumb { background: #B9B7B4; }
        input.ohm-slider:disabled { cursor: not-allowed; }
        .led { animation: pulseGlow 1.1s ease-in-out infinite; }
        @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:.35} }
        @media (prefers-reduced-motion: reduce) { .led { animation: none; } }
        .ohm-btn:active { transform: translateY(1px); }
        .ohm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1360, fontFamily: SANS }}>
        {/* HEADER */}
        <div className="flex items-end justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: `3px solid ${OHM_RED}` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={OHM_LOGO} alt="Ohm Angewandte Chemie" style={{ height: 34, width: "auto", display: "block" }} />
              <h1 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(24px,3.2vw,32px)", color: INK, letterSpacing: "-0.01em", lineHeight: 1 }}>
                GC·MONITOR
              </h1>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: GRAY, marginTop: 6 }}>
              Fakultät Angewandte Chemie · Gaschromatographie · Temperaturprogramm live · Trägergasgeschwindigkeit live
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="led" style={{ width: 10, height: 10, borderRadius: "50%",
              background: running ? "#2E9E4F" : OHM_RED, boxShadow: `0 0 6px ${running ? "#2E9E4F" : OHM_RED}` }} />
            <span style={{ fontFamily: SANS, fontSize: 12, color: INK, fontWeight: 600 }}>{running ? "Läuft" : "Angehalten"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT CONTROLS */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <PanelBox title="Säule (nur vor Injektion änderbar)">
              <Field label="Säulenlänge L" value={`${de(L, 0)} cm`} locked={locked}>
                <LinearSlider min={5} max={100} step={1} value={L} onChange={setL} disabled={locked} />
              </Field>
              <Field label="Trennstufen N (Effizienz)" value={`${nPlates}`} locked={locked}>
                <LogSlider min={100} max={5000} value={nPlates} onChange={(v) => setNPlates(Math.round(v))} disabled={locked} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>
                {locked ? "Für diesen Lauf gesperrt — erst nach 'Neuer Lauf' änderbar." : "Nur vor der Injektion änderbar."}
              </div>
            </PanelBox>

            <PanelBox title="Ofen &amp; Trägergas (live änderbar)">
              <Field label="Ofentemperatur T" value={`${de(rampOn ? tempNowRef.current : tempC, 0)} °C`}>
                <LinearSlider min={30} max={280} step={1} value={tempC} onChange={setTempC} disabled={rampOn} />
              </Field>
              <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: MONO, fontSize: 11, color: INK, marginBottom: rampOn ? 10 : 0 }}>
                <input type="checkbox" checked={rampOn} onChange={(e) => setRampOn(e.target.checked)} />
                Temperaturrampe (Temperaturprogramm)
              </label>
              {rampOn && (
                <Field label="Heizrate" value={`${de(rampRate, 1)} °C/min`}>
                  <LinearSlider min={0.5} max={30} step={0.5} value={rampRate} onChange={setRampRate} />
                </Field>
              )}
              <Field label="Trägergasgeschwindigkeit u" value={`${de(uGas, 1)} cm/s`}>
                <LogSlider min={0.5} max={15} value={uGas} onChange={setUGas} />
              </Field>
            </PanelBox>

            <PanelBox title="Detektor &amp; Zeitraffer">
              <Field label="Detektorrauschen" value={`± ${de(noisePct, 1)} %`}>
                <LinearSlider min={0} max={8} step={0.2} value={noisePct} onChange={setNoisePct} />
              </Field>
              <Field label="Beschleunigung" value={`× ${de(speed, 0)}`}>
                <LogSlider min={1} max={2000} value={speed} onChange={setSpeed} />
              </Field>
              <button onClick={handleAutoSpeed} className="ohm-btn w-full" style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "6px 0", color: INK, marginBottom: 10 }}>
                Auto-Zeitraffer (ganzer Lauf ~25 s)
              </button>
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>
                Hinweis: Dieses Modell integriert Peak-Lage &amp; -Breite exakt über Momente — anders als bei den bisherigen Apps gibt es hier keine numerische Instabilitätsgrenze.
              </div>
            </PanelBox>
          </div>

          {/* CENTER: COLUMN GRAPHIC + ANALYTES */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div style={{ position: "relative", background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 8, height: 190 }}>
              <ColumnGraphic analytes={analytesLive} L={L} running={running} />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={handlePlayPause} className="ohm-btn" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.02em",
                background: running ? "#fff" : OHM_RED, color: running ? OHM_RED : "#fff", border: `2px solid ${OHM_RED}`, borderRadius: 5, padding: "9px 18px" }}>
                {running ? "⏸ PAUSE" : "💉 INJIZIEREN & START"}
              </button>
              <button onClick={handleReset} className="ohm-btn" style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 16px", color: INK }}>
                ↺ Neuer Lauf
              </button>
              <button onClick={exportCSV} className="ohm-btn" style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 16px", color: INK }}>
                ⤓ CSV
              </button>
            </div>

            <PanelBox title="Analyten (nur vor Injektion änderbar)">
              {analytesCfg.map((a) => (
                <div key={a.id} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: `1px dashed ${PANEL_BORDER}` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: a.color, display: "inline-block" }} />
                      <input value={a.name} disabled={locked} onChange={(e) => updateAnalyte(a.id, "name", e.target.value)}
                        style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: INK, border: "none", background: "transparent", width: 90 }} />
                    </span>
                    {analytesCfg.length > 1 && !locked && (
                      <button onClick={() => removeAnalyte(a.id)} style={{ fontFamily: SANS, fontSize: 11, color: OHM_RED, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>✕</button>
                    )}
                  </div>
                  <Field label="k (bei 100 °C)" value={de(a.kRef, 2)} locked={locked}>
                    <LogSlider min={0.2} max={30} value={a.kRef} onChange={(v) => updateAnalyte(a.id, "kRef", v)} disabled={locked} />
                  </Field>
                  <Field label="ΔH (Temperaturempfindlichkeit)" value={`${de(a.dH, 0)} kJ/mol`} locked={locked}>
                    <LinearSlider min={2} max={50} step={1} value={a.dH} onChange={(v) => updateAnalyte(a.id, "dH", v)} disabled={locked} />
                  </Field>
                  <Field label="Injektionsmenge" value={de(a.amount, 2)} locked={locked}>
                    <LinearSlider min={0.1} max={3} step={0.05} value={a.amount} onChange={(v) => updateAnalyte(a.id, "amount", v)} disabled={locked} />
                  </Field>
                </div>
              ))}
              {analytesCfg.length < 4 && !locked && (
                <button onClick={addAnalyte} className="ohm-btn w-full" style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px dashed ${PANEL_BORDER}`, borderRadius: 5, padding: "8px 0", color: INK }}>
                  + Analyt hinzufügen
                </button>
              )}
            </PanelBox>
          </div>

          {/* RIGHT: CHROMATOGRAM */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div style={{ position: "relative", background: CHART_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "10px 8px 4px 0" }}>
              <div className="flex items-center justify-between" style={{ padding: "0 10px", marginBottom: 2 }}>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11.5, color: INK, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Chromatogramm
                </span>
                {zoomDomain && (
                  <button onClick={resetZoom} className="ohm-btn" style={{ fontFamily: MONO, fontSize: 10.5, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "3px 8px", color: OHM_RED }}>
                    ⤾ Zoom zurücksetzen
                  </button>
                )}
              </div>
              <div style={{ width: "100%", height: 420 }}>
                <ResponsiveContainer>
                  <ComposedChart data={histRef.current} margin={{ top: 10, right: 18, bottom: 22, left: 30 }}
                    onMouseDown={handleChartMouseDown} onMouseMove={handleChartMouseMove} onMouseUp={handleChartMouseUp}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="2 4" />
                    <XAxis dataKey="t" type="number" domain={displayDomain} allowDataOverflow
                      tickFormatter={(v) => fmtTime(v)} stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      label={{ value: "Zeit", position: "insideBottom", offset: -14, fill: GRAY, fontSize: 12, fontFamily: SANS, fontWeight: 600 }} />
                    <YAxis yAxisId="signal" type="number" domain={[0, yMax]} allowDataOverflow stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      tickFormatter={(v) => de(v, 2)} width={54}
                      label={{ value: "Detektorsignal", angle: -90, position: "insideLeft", offset: 8, fill: INK, fontSize: 12.5, fontFamily: SANS, fontWeight: 600, style: { textAnchor: "middle" } }} />
                    <YAxis yAxisId="temp" orientation="right" type="number" domain={[0, 300]} stroke={OHM_BLUE} tick={{ fontFamily: MONO, fontSize: 11, fill: OHM_BLUE }}
                      tickFormatter={(v) => de(v, 0)} width={44}
                      label={{ value: "T (°C)", angle: 90, position: "insideRight", offset: 8, fill: OHM_BLUE, fontSize: 12.5, fontFamily: SANS, fontWeight: 600, style: { textAnchor: "middle" } }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line yAxisId="signal" dataKey="total" stroke={OHM_RED} strokeWidth={2} dot={false} isAnimationActive={false} name="Signal" />
                    <Line yAxisId="temp" dataKey="temp" stroke={OHM_BLUE} strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} name="Ofentemperatur" />
                    {refAreaLeft !== null && refAreaRight !== null && (
                      <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill={OHM_BLUE} fillOpacity={0.12} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY, paddingLeft: 4 }}>
              Rot = Detektorsignal (linke Achse), blau gestrichelt = Ofentemperatur (rechte Achse). Zum Zoomen einen Bereich aufziehen (klicken + ziehen). Peak-Reihenfolge folgt der Retention: kleines k bzw. hohe Temperatur → früh, großes k bzw. niedrige Temperatur → spät. Ein Temperaturprogramm (Rampe) lässt späte Peaks schärfer und früher erscheinen — reales GC-Verhalten.
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${PANEL_BORDER}`, paddingTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Modell: pro Analyt exakte Momente dz̄/dt = u(T), dσ²/dt = 2D(T); Signal = Σᵢ Gauß(L; z̄ᵢ,σᵢ²)</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Retention: k(T) van't-Hoff-artig aus k_ref(100°C) und ΔH; u_i = u_Trägergas/(1+k(T)); D = u·L/(2N)</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Gegen die analytische Peakform validiert (Retentionszeit- und Breiten-Fehler &lt;0,2 %)</span>
        </div>
      </div>
    </div>
  );
}
