import { useEffect, useState } from "react";
import axios from "axios";

const setLocalStorage = (refreshToken, expiresIn) => {
  window.localStorage.setItem("spotify_refresh_token", refreshToken);
  window.localStorage.setItem("spotify_expires_in", expiresIn);
  window.localStorage.setItem("spotify_timestamp", Date.now());
};

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [authCheck, setAuthCheck] = useState(false);

  // axios defaults
  axios.defaults.baseURL = "https://api.spotify.com/v1";
  axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers["Content-Type"] = "application/json";

  useEffect(() => {
    const rf = window.localStorage.getItem("spotify_refresh_token");
    async function check() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");
      const expiresIn = urlParams.get("expires_in");
      if (accessToken) {
        setLocalStorage(refreshToken, expiresIn);
        setToken(accessToken);
        setAuthCheck(true);
      } else if (rf && rf !== "undefined") {
        try {
          const response = await axios.get(
            `/refresh_token?refresh_token=${rf}`,
            {
              baseURL: "",
            }
          );

          const data = response.data;
          console.log("refreshed");
          window.localStorage.setItem("spotify_timestamp", Date.now());

          setToken(data.access_token);
          setAuthCheck(true);
        } catch (err) {
          console.log(err);
        }
      } else {
        setAuthCheck(true);
      }
    }
    check();
  }, []);

  // if url has token
  // get access token > setToken(access_token)
  // set refresh token in localstorage
  // expires_in in localstorage
  // set Date.now() in localstorage
  // else
  // if l.refresh_token isNot empty
  //
  // else
  // login

  // expired checking is inside useSpotify api calls only before call axios.get if expired then do userefresh

  return { token, authCheck };
};
