export const APP_PATHS = ['/', '/course', '/guide', '/privacy', '/about'] as const;

export type AppPath = (typeof APP_PATHS)[number];

// 未知地址回到首页，避免刷新后停在没有对应页面的路径。
export function resolveAppPath(pathname: string): AppPath {
  const bare = pathname.split('?')[0]?.split('#')[0] ?? '/';
  const trimmed = bare.length > 1 ? bare.replace(/\/+$/, '') : bare;
  return (APP_PATHS as readonly string[]).includes(trimmed) ? (trimmed as AppPath) : '/';
}
