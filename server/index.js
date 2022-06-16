require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = 8000;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

app.get("/", (req, res) => {
  res.json({ name: "haresh" });
});

// getRandomString for state
const generateRandomString = (length) => {
  let text = "";
  const characters =
    "QWERTYUIOPASDFGHJKLZXCVBNM147258369qwertyuiopasdfghjklzxcvbnm";

  for (let i = 0; i < length; i++) {
    text += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return text;
};

const stateKey = "spotify_auth_state";

app.get("/login", (req, res) => {
  // send a cookie to user's browser to save the state
  const state = generateRandomString();
  res.cookie(stateKey, state);

  const scope = "user-read-private user-read-email";

  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state,
    scope,
  }).toString();

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    // response

    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;

      const q = new URLSearchParams({
        access_token,
        refresh_token,
        expires_in,
      }).toString();

      // redirect to react app
      res.redirect(`http://localhost:3000?${q}`);
    } else {
      res.redirect(`http://localhost:3000?error=true`);
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/refresh_token", async (req, res) => {
  const { refresh_token } = req.query;
  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }).toString(),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (response.status === 200) {
      const { access_token } = response.data;

      res.json({ access_token });
    } else {
      throw new Error("could not get access token, error happen");
    }
  } catch (err) {
    res.send(err);
  }
});

app.listen(port || process.env.PORT, () => {
  console.log("server running on 8000");
});
