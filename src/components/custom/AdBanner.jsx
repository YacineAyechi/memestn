import React, { useEffect } from "react";

const AdBanner = ({ dataAdSlot, dataAdFormalt, dataFullWidthResponsive }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  //   useEffect(() => {
  //     const ads = document.querySelectorAll(".adsbygoogle");
  //     ads.forEach((ad) => {
  //       (window.adsbygoogle = window.adsbygoogle || []).push({});
  //     });
  //   }, []);

  return (
    <div className="w-full bg-gray-200 rounded-md mb-6 p-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4926211598967441"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormalt}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;
