export default function useQuery() {
  const hashes = window.location.hash
    .slice(window.location.hash.indexOf("?") + 1)
    .split("&");
  const params = {};
  hashes.map(hash => {
    const [key, val] = hash.split("=");
    params[key] = decodeURIComponent(val);
  });
  return params;
}
