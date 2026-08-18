import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const nextTypesDir = path.join(process.cwd(), ".next", "types");
const nextDevTypesDir = path.join(process.cwd(), ".next", "dev", "types");

const routesDtsPath = path.join(nextTypesDir, "routes.d.ts");
const routesJsShimPath = path.join(nextTypesDir, "routes.js.d.ts");
const routesJsDevShimPath = path.join(nextDevTypesDir, "routes.js.d.ts");

const shimContents = `type AppRoutes = VinextRouteTypes.AppRoute;
type PageRoutes = VinextRouteTypes.PageRoute;
type LayoutRoutes = VinextRouteTypes.LayoutRoute;
type RedirectRoutes = never;
type RewriteRoutes = never;
type ParamMap = VinextRouteTypes.ParamMap;

export type {
  AppRoutes,
  PageRoutes,
  LayoutRoutes,
  RedirectRoutes,
  RewriteRoutes,
  ParamMap,
};
`;

function writeShim(targetDir) {
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(path.join(targetDir, "routes.js.d.ts"), shimContents);
}

if (existsSync(routesDtsPath)) {
  const routeTypes = readFileSync(routesDtsPath, "utf8");
  if (routeTypes.includes("VinextRouteTypes")) {
    writeShim(nextTypesDir);
    if (existsSync(nextDevTypesDir)) {
      writeShim(nextDevTypesDir);
    }
    process.exit(0);
  }
}

for (const target of [routesJsShimPath, routesJsDevShimPath]) {
  if (existsSync(target)) {
    rmSync(target, { force: true });
  }
}
