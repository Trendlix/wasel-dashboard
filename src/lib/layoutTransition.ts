import type { UIMatch } from "react-router-dom";

export type AppRouteHandle = {
  /** When set on a matched route, layout page transitions use this key instead of pathname (keeps nested shells mounted). */
  transitionGroup?: string;
};

export function getLayoutTransitionKey(
  matches: UIMatch[],
  pathname: string
): string {
  for (let i = matches.length - 1; i >= 0; i--) {
    const group = (matches[i].handle as AppRouteHandle | undefined)
      ?.transitionGroup;
    if (group) return group;
  }
  return pathname;
}
