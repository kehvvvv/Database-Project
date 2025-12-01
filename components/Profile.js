import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import EditProfile from "./EditProfile";
import FollowButton from "./FollowButton";

function Profile() {
  const { username } = useParams();
  const [accountList, setAccountList] = useState([]);
  const [accountData, setAccountData] = useState({});
  const [clicked, setClick] = useState(false);
  const [openEdit, setEdit] = useState(false);

  const handleAccountClick = (account) => {
    setAccountData(account);
    console.log("Clicked:", account);
    // You can navigate, open a profile, etc.
  };

  const handleSearch = async (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    try {
      const response = await fetch(
        `http://localhost:8000/api/${username}/search/${lowerCaseSearchTerm}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const accounts = await response.json();
      setAccountList(accounts.users);
      console.log("accounts worked", accounts.status);
      console.log(accounts);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    async function load_account_info() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/account/${username}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log(data.account);
        setAccountData(data.account);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    load_account_info();
  }, [username]);

  return (
    <nav className="d-flex flex-column">
      <div>
        <div>
          <SearchBar onSearch={handleSearch} />
          <ul style={{ listStyle: "none", padding: 0 }}>
            {accountList.map((acc) => (
              <li
                key={acc.id}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <button
                  onClick={() => handleAccountClick(acc)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <strong>{acc.name}</strong>
                  <div style={{ color: "#666" }}>@{acc.username}</div>
                </button>
              </li>
            ))}

            {accountList.length === 0 && (
              <div style={{ color: "#888", padding: "8px" }}>
                No accounts found
              </div>
            )}
          </ul>
        </div>
        <FollowButton profileUser={accountData} />
        <div>
          <button onClick={() => setEdit(true)}> Edit Profile </button>
          {openEdit ? (
            <EditProfile
              postClickedOut={() => setEdit(false)}
              currentUser={username}
            />
          ) : (
            <div>
              <h2 className="d-flex justify-content-center">
                {accountData.username}
              </h2>
              <main className="d-flex flex-grow-1">
                <div className="d-flex flex-grow-1 flex-column align-items-center">
                  Posts
                  <h3>12</h3>
                </div>
                <div className="d-flex flex-grow-1 flex-column align-items-center">
                  Followers
                  <h3>10</h3>
                </div>
                <div className="d-flex flex-grow-1 flex-column align-items-center">
                  Following
                  <h3>12</h3>
                </div>
              </main>
              <p>{accountData.biography}</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Profile;