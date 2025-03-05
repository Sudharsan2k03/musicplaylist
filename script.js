const API_KEY = 'AIzaSyAU-cUMd8DS4aGHHrSAa1V8U0rsK5rBBfw';
const API_URL = 'https://www.googleapis.com/youtube/v3/search';
let nextPageToken = null; // Store next page token for loading more results

async function generatePlaylist() {
    const mood = document.getElementById("mood").value.toLowerCase();
    const language = document.getElementById("language").value.toLowerCase();
    const playlistDiv = document.getElementById("playlist");

    playlistDiv.innerHTML = "<h2>Loading playlist...</h2>";
    nextPageToken = null; // Reset pagination
    await fetchSongs(mood, language);
}

async function fetchSongs(mood, language) {
    const playlistDiv = document.getElementById("playlist");

    try {
        let url = `${API_URL}?part=snippet&q=${mood}+${language}+songs&type=video&maxResults=20&key=${API_KEY}`;
        if (nextPageToken) url += `&pageToken=${nextPageToken}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            playlistDiv.innerHTML = "<h2>No songs found for this selection.</h2>";
            return;
        }

        if (!nextPageToken) playlistDiv.innerHTML = `<h2>Your ${mood} ${language} Playlist 🎶</h2>`;

        data.items.forEach(video => {
            const songElement = document.createElement("div");
            songElement.classList.add("song");
            songElement.innerHTML = `<a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">${video.snippet.title}</a>`;
            playlistDiv.appendChild(songElement);
        });

        nextPageToken = data.nextPageToken || null; // Store next page token for loading more results
    } catch (error) {
        playlistDiv.innerHTML = "<h2>Error fetching songs. Please try again.</h2>";
        console.error("Error fetching songs:", error);
    }
}

// Infinite Scroll: Load more songs when user reaches bottom
document.getElementById("playlist").addEventListener("scroll", function () {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10 && nextPageToken) {
        fetchSongs(document.getElementById("mood").value.toLowerCase(), document.getElementById("language").value.toLowerCase());
    }
});
