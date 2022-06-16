import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("/me");
      console.log(res.data);
      setProfile(res.data);
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {profile && (
        <div>
          <div className="banner">
            <div className="profile-img">
              <img src={profile.images[0].url} alt="" />
            </div>
            <p className="profile-name">{profile.display_name}</p>
          </div>
          <p>top-artists</p>
          <p>top-tracks</p>
          <p>top-playlists</p>
        </div>
      )}
    </div>
  );
}
