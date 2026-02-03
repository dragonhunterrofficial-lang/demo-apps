(() => {
  const rewardedOverlay = document.getElementById("rewarded-ad");
  const rewardedTimer = document.getElementById("ad-timer");
  const bannerAd = document.getElementById("banner-ad");

  function showBannerAd() {
    bannerAd.textContent = "Banner Ad Placeholder";
  }

  function hideBannerAd() {
    bannerAd.textContent = "";
  }

  function showRewardedAd({ onComplete }) {
    rewardedOverlay.classList.remove("hidden");
    rewardedOverlay.setAttribute("aria-hidden", "false");
    let remaining = 3;
    rewardedTimer.textContent = remaining;

    const timer = setInterval(() => {
      remaining -= 1;
      rewardedTimer.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(timer);
        rewardedOverlay.classList.add("hidden");
        rewardedOverlay.setAttribute("aria-hidden", "true");
        if (typeof onComplete === "function") {
          onComplete();
        }
      }
    }, 1000);
  }

  window.Ads = {
    showBannerAd,
    hideBannerAd,
    showRewardedAd,
  };
})();
