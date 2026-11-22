// Canonical issuer origin for the current request.
//
// Everything that describes this API — the RFC 9728 protected-resource metadata,
// the authorization-server metadata, the RFC 6750 challenge on /api/content and
// the JWT `iss`/`aud` — must agree on one origin, and it must be the origin the
// caller actually reaches.
//
// These values used to be hardcoded to https://staging.visa2.au. On production
// that meant:
//   * tokens were signed with iss=https://staging.visa2.au while the metadata
//     advertised issuer=https://visa2.au, so no agent could ever validate a token;
//   * the 401 challenge pointed agents at a staging token endpoint.
//
// www.* collapses to the apex, matching functions/_middleware.ts, which rewrites
// every discovery document's origin to the apex (never a www. host). Keeping the
// same normalisation here is what keeps the JWT issuer equal to the advertised
// issuer on every host.
export function issuerFor(request: Request): string {
  const host = new URL(request.url).hostname;
  const apex = host.startsWith("www.") ? host.slice(4) : host;
  return `https://${apex}`;
}

/** The protected resource this API represents (used as the JWT audience). */
export function audienceFor(request: Request): string {
  return `${issuerFor(request)}/api`;
}

/** RFC 9728 §5.1 challenge: point agents at the protected-resource metadata. */
export function realmFor(request: Request): string {
  return `Bearer realm="api", resource_metadata="${issuerFor(request)}/.well-known/oauth-protected-resource"`;
}
