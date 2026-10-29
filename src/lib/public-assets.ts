export function getPublicAssetPath(src: string): string {
  return src.startsWith("/images/")
    ? src.replace(/^\/images\//, "/test/")
    : src;
}