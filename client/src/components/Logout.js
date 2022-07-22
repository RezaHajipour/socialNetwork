function Logout() {
    async function onSubmit(e) {
        e.preventDefault();

        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/";
    }
    return (
        <form onSubmit={onSubmit} className="logout">
            <button>
                <img
                    src="/images/logout-btn.png"
                    className="logout-btn-img"
                    aria-hidden="true"
                />
                logout
            </button>
        </form>
    );
}

export default Logout;

//  <button className="logout-btn">logout</button>;
