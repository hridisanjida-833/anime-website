const searchInput = document.getElementById("animeSearch");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", async function () {
    const animeName = searchInput.value.trim();

    if (animeName === "") {
        alert("Please enter an anime name!");
        return;
    }

    try {
        const response = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`
        );

        if (!response.ok) {
            throw new Error("API server error: " + response.status);
        }

        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            alert("Anime not found!");
            return;
        }

        const anime = result.data[0];

        alert(
            "Anime: " + anime.title +
            "\nRating: " + (anime.score ?? "N/A") +
            "\nEpisodes: " + (anime.episodes ?? "N/A") +
            "\nStatus: " + (anime.status ?? "N/A")
        );

    } catch (error) {
        console.error("Error:", error);
        alert("The anime service is temporarily unavailable. Please try again.");
    }
});