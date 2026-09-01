export function getQueryStringParam(name) {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.has(name) ? params.get(name) : null;
}
