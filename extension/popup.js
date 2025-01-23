async function fetchContent() {
  const url = document.getElementById("urlInput").value.trim();
  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/extract?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error("Failed to fetch content");

    const data = await response.json();
    localStorage.setItem("extractedContent", JSON.stringify(data));
    chrome.tabs.create({
      url: `http://localhost:3000/display.html?url=${encodeURIComponent(url)}`
    });

  } catch (error) {
    console.error("Error fetching content:", error.message);
    alert(`Failed to load content. Error: ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("send-link").addEventListener("click", fetchContent);

  document.querySelector(".open-website").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000/" });
  });
});
