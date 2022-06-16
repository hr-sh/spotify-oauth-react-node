function setLOCALSTORAGE(accessToken, refreshToken, expiresIn) {
  console.log("setting local storage");
  window.localStorage.setItem("spotify_access_token", accessToken);
  window.localStorage.setItem("spotify_refresh_token", refreshToken);
  window.localStorage.setItem("spotify_expires_in", expiresIn);
  window.localStorage.setItem("spotify_timestamp", Date.now());
}

const getRefreshToken = async () => {
  const rf = window.localStorage.getItem("spotify_refresh_token");
  try {
    const res = await axios.get(`/refresh_token?refresh_token=${rf}`);

    const data = await res.json();
    console.log("got new access token using ref token");
    window.localStorage.setItem("spotify_access_token", data.access_token);
    window.localStorage.setItem("spotify_timestamp", Date.now());
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};

const LOCALSTORAGE = {
  accessToken: window.localStorage.getItem("spotify_access_token"),
  refreshToken: window.localStorage.getItem("spotify_refresh_token"),
  expiresIn: window.localStorage.getItem("spotify_expires_in"),
  timestamp: window.localStorage.getItem("spotify_timestamp"),
};

const getToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const accessToken = urlParams.get("access_token");
  const refreshToken = urlParams.get("refresh_token");
  const expiresIn = urlParams.get("expires_in");
  const error = urlParams.get("error");

  if (LOCALSTORAGE.accessToken && LOCALSTORAGE.accessToken !== "undefined") {
    let expired =
      (Date.now() - JSON.parse(LOCALSTORAGE.timestamp)) / 1000 >
      JSON.parse(LOCALSTORAGE.expiresIn);

    console.log("expired: ", expired);

    if (expired) {
      console.log("need to refresh token");

      // refresh
      getRefreshToken();
    } else {
      console.log("found token in local storage");
      return LOCALSTORAGE.accessToken;
    }
  }

  if (!accessToken || error) {
    console.log(
      "no accesstoken and local copy present, sending null, please login"
    );
    return null;
  }

  // set localstorage
  setLOCALSTORAGE(accessToken, refreshToken, expiresIn);
  return accessToken;
};

export const accessToken = getToken();

export const logout = () => {
  window.localStorage.removeItem("spotify_access_token");
  window.localStorage.removeItem("spotify_refresh_token");
  window.localStorage.removeItem("spotify_expires_in");
  window.localStorage.removeItem("spotify_timestamp");
  //redirect
  window.location = window.location.origin;
};

// get user profile from spotify
export const getCurrentUserProfile = () => {
  return axios.get("/me");
};
