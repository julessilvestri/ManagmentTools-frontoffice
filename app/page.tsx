"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige après que le composant soit monté
    router.push("/login");
  }, [router]); // Le tableau de dépendances garantit que la redirection se fait seulement après le premier rendu
}
