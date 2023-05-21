const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = "xxxxxxxxxxxxxxxxxx";

const promptInput = document.querySelector(".promptInput");
const generateBtn = document.querySelector(".generateBtn");
const stopBtn = document.querySelector(".stopBtn");
const textArea = document.querySelector(".textArea");

let controller = null;
const generate = async () => {
  if (!promptInput.value) {
    alert("Please enter a prompt.");
    return;
  }

  generateBtn.disabled = true;
  stopBtn.disabled = false;
  textArea.innerText = "Generating...";

  controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: promptInput.value }],
        max_tokens: 100,
      }),
      signal,
    });

    const data = await response.json();
    textArea.innerText = data.choices[0].message.content;
  } catch (error) {
    if (signal.aborted) {
      textArea.innerText = "Request aborted.";
    } else {
      console.error("Error:", error);
      textArea.innerText = "Error occurred while generating.";
    }
  } finally {
    // Enable the generate button and disable the stop button
    generateBtn.disabled = false;
    stopBtn.disabled = true;
    controller = null; // Reset the AbortController instance
  }
};

const stop = () => {
  // Abort the fetch request by calling abort() on the AbortController instance
  if (controller) {
    controller.abort();
    controller = null;
  }
};

promptInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    generate();
  }
});
generateBtn.addEventListener("click", generate);
stopBtn.addEventListener("click", stop);
