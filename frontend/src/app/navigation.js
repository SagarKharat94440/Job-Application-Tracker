import { useEffect, useState } from "react";

export function navigate(path) {
  window.location.hash = path;
}

export function useRoute() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || "/");

  useEffect(() => {
    const update = () => setRoute(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return route;
}
