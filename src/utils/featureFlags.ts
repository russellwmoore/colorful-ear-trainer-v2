const params = new URLSearchParams(window.location.search);

export const featureFlags = {
  disableUserOnPlay: params.get("feature") === "disable_user",
};
