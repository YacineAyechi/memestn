"use client";

import { useEffect } from "react";

export default function AdComponent() {
  useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, []);

  return (
    <div className="w-full bg-gray-200 rounded-md mb-6 p-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4926211598967441"
        data-ad-slot="6000249489"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
