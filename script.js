const searchInput = document.getElementById("animeSearch");
const searchButton = document.getElementById("searchButton");
const animeResult = document.getElementById("animeResult");


// =========================
// Anime Search
// =========================

searchButton.addEventListener("click", async function () {

    const animeName = searchInput.value.trim();

    if (animeName === "") {
        alert("Please enter an anime name!");
        return;
    }

    animeResult.innerHTML = "<p>Searching...</p>";

    const query = `
        query ($search: String) {
            Page(page: 1, perPage: 1) {
                media(search: $search, type: ANIME) {

                    title {
                        romaji
                        english
                    }

                    coverImage {
                        large
                    }

                    startDate {
                        year
                        month
                        day
                    }

                    averageScore
                    episodes
                    status
                    genres

                    description(asHtml: false)
                }
            }
        }
    `;

    try {

        const response = await fetch(
            "https://graphql.anilist.co",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    query: query,
                    variables: {
                        search: animeName
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error("API Error");
        }

        const result = await response.json();

        if (
            !result.data ||
            result.data.Page.media.length === 0
        ) {

            animeResult.innerHTML =
                "<p>Anime not found!</p>";

            return;
        }

        const anime = result.data.Page.media[0];

        const title =
            anime.title.english ||
            anime.title.romaji;

        const releaseDate =
            anime.startDate.year
                ? `${anime.startDate.day || "N/A"}/${anime.startDate.month || "N/A"}/${anime.startDate.year}`
                : "N/A";

        const genres =
            anime.genres.length > 0
                ? anime.genres.join(", ")
                : "N/A";

        const synopsis =
            anime.description
                ? anime.description.replace(/<[^>]*>/g, "")
                : "No synopsis available.";

        animeResult.innerHTML = `

            <div class="anime-card">

                <img
                    src="${anime.coverImage.large}"
                    alt="${title}"
                >

                <h2>${title}</h2>

                <p>
                    <strong>Release Date:</strong>
                    ${releaseDate}
                </p>

                <p>
                    <strong>Rating:</strong>
                    ${
                        anime.averageScore
                            ? anime.averageScore + "/100"
                            : "N/A"
                    }
                </p>

                <p>
                    <strong>Episodes:</strong>
                    ${anime.episodes || "N/A"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${anime.status || "N/A"}
                </p>

                <p>
                    <strong>Genre:</strong>
                    ${genres}
                </p>

                <p>
                    <strong>Synopsis:</strong><br>
                    ${synopsis}
                </p>

            </div>

        `;

    } catch (error) {

        console.error("Error:", error);

        animeResult.innerHTML =
            "<p>Something went wrong. Please try again.</p>";
    }
});


// =========================
// Register
// =========================

const registerButton =
    document.getElementById("registerButton");

registerButton.addEventListener("click", async function () {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value.trim();

    const registerMessage =
        document.getElementById("registerMessage");


    if (!name || !email || !password) {

        registerMessage.textContent =
            "Please fill in all fields.";

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:8080/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            registerMessage.textContent =
                data.message || "Registration failed.";

            return;
        }


        registerMessage.textContent =
            data.message;

    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Cannot connect to server.";
    }
});


// =========================
// Login
// =========================

const loginButton =
    document.getElementById("loginButton");

loginButton.addEventListener("click", async function () {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const loginMessage =
        document.getElementById("loginMessage");


    if (!email || !password) {

        loginMessage.textContent =
            "Please enter email and password.";

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:8080/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            loginMessage.textContent =
                data.message || "Login failed.";

            return;
        }


        loginMessage.textContent =
            `${data.message} Welcome, ${data.name}!`;

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Cannot connect to server.";
    }
});