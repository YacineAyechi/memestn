import Script from "next/script";
import React from "react";

const AdComponent = () => {
  return (
    <Script
      async
      src={`src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.pId}"`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      id="adsense-"
    />
  );
};

export default AdComponent;
