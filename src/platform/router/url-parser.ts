export function normalizePathname(baseHref: string, path: string): [string, string, string] {
  console.log({ baseHref, path })
  // Normalize baseHref: remove trailing slash (unless it's just "/"), lowercase, default empty to "/"
  let normalizedBase: string;
  if (!baseHref || baseHref === '/') {
    normalizedBase = '/';
  } else {
    normalizedBase = baseHref.replace(/\/$/, '').toLowerCase();
  }
  
  // Normalize path: lowercase
  const normalizedPath = path.toLowerCase();
  
  // Calculate full path
  let fullPath: string;
  if (normalizedPath === '/') {
    // If path is just "/", fullPath is the base
    fullPath = normalizedBase;
  } else {
    // Combine base and path
    fullPath = normalizedBase === '/' 
      ? normalizedPath 
      : normalizedBase + normalizedPath;
  }
  
  return [normalizedBase, normalizedPath, fullPath];
}

/**
 * @description
 * Will match a url declaration with an incoming pathname
 *   /users/:id/edit
 *   /users/5345/edit
 */
export const matchPath = (
  baseHref: string,
  pattern: string,
  pathname: string,
): Record<string, string> | undefined => {
  const [base, path, fullPath] = normalizePathname(baseHref, pattern);
  const params: Record<string, string> = {};
  const source = pattern.split("/");
  const test = fullPath.split("/");

  if (source.length !== test.length && !pattern.includes("**")) {
    return;
  }

  for (const i in source) {
    if (source[i].startsWith(":") && fullPath !== "/") {
      const paramName = source[i].slice(1);
      params[paramName] = test[i].toString();
      continue;
    }
    if (source[i].startsWith("**")) {
      return params;
    }
    if (source[i] !== test[i].toLowerCase()) {
      return;
    }
  }
  return params;
};
