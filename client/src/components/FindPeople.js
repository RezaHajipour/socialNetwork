import { useState, useEffect } from "react";
import useTitle from "../hooks/useTitle.js";
import { Link } from "react-router-dom";
function FindPeople() {
    useTitle("find people");
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        fetch("/api/users/recent?limit=3")
            .then((res) => res.json())
            .then((data) => setRecentUsers(data));
    }, []);

    function onFormSubmit(event) {
        event.preventDefault();
        const userInput = event.target.search.value;

        fetch("/api/users/search?query=" + userInput)
            .then((res) => res.json())
            .then((data) => {
                setSearchResult(data);
            });
    }
    console.log("searchResult", searchResult);
    return (
        <section className="find-people">
            <section className="recent_users_container">
                <h3>RECENT USERS</h3>

                <ul className="recent_users_list">
                    {recentUsers.map((user) => (
                        <li key={user.id}>
                            <img
                                src={user.profile_picture_url}
                                className="recent-users-image"
                            />

                            <Link
                                to={`/user/${user.id}`}
                                className="recent-users-link"
                            >
                                {user.first_name} {user.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <form onSubmit={onFormSubmit} className="search-form">
                <input
                    type="search"
                    name="search"
                    placeholder="search"
                    required
                    className="search-form-input"
                />
                <button type="submit" className="search-form-button">
                    Search
                </button>
            </form>
            <section className="display-search">
                <ul className="display-search-ul">
                    {searchResult.map((user) => (
                        <li key={user.id}>
                            <Link
                                to={`/user/${user.id}`}
                                className="display-search-link"
                            >
                                <img
                                    src={user.profile_picture_url}
                                    className="recent-users-image"
                                />
                                {user.first_name} {user.last_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}

export default FindPeople;
