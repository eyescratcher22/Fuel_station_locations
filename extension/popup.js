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

    window.location.href = "display.html";
  } catch (error) {
    console.error("Error fetching content:", error);
    alert("Failed to load content. Please try again.");
  }
}
