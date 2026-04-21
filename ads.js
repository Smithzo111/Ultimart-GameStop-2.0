const HIDDEN_AD_STATUSES = new Set(["unfilled", "unfill-optimized"]);

const syncAdSectionState = (slot) => {
    const section = slot.closest(".adsense-section");
    if (!section) {
        return;
    }

    const status = slot.getAttribute("data-ad-status");
    section.classList.remove("adsense-section--filled", "adsense-section--hidden");

    if (status === "filled") {
        section.classList.add("adsense-section--filled");
        return;
    }

    if (HIDDEN_AD_STATUSES.has(status)) {
        section.classList.add("adsense-section--hidden");
    }
};

const observeAdSlots = () => {
    const slots = document.querySelectorAll(".adsense-section .adsbygoogle");

    slots.forEach((slot) => {
        syncAdSectionState(slot);

        const observer = new MutationObserver(() => {
            syncAdSectionState(slot);
        });

        observer.observe(slot, {
            attributes: true,
            attributeFilter: ["data-ad-status"]
        });
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeAdSlots);
} else {
    observeAdSlots();
}
