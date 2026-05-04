export function getQueryStringParam(name) {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.has(name) ? params.get(name) : null;
}

export function ssrRedirect(ssrUrl, fallbackRoute = "/") {
  window.history.replaceState({}, "", fallbackRoute);
  window.location.href = ssrUrl;
}