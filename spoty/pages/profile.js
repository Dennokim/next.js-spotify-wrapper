import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (session && session.accessToken) {
        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        } else {
          console.log(
            "Error fetching user profile:",
            profileResponse.statusText
          );
        }
      }
    }
    fetchProfile();
  }, [session]);

  return (
    <main className="">
      <div className="">
        {profile && (
          <div>
            <img src={profile.images[0].url} alt="User profile" width={100} height={100} />
            <h2>Welcome: {profile.display_name}</h2>
            <div>Followers: {profile.followers.total}</div>
          </div>
        )}
      </div>
    </main>
  );
}
