// ============================================
// EduGenie - ChatGPT Style Chat History
// ============================================

let selectedTask = "qa";
let isSending = false;

let chats = [];
let currentChatId = null;


// ============================================
// DOM
// ============================================

const input = document.getElementById("input-text");
const submitBtn = document.getElementById("submit-btn");

const resultArea = document.getElementById("result-area");
const result = document.getElementById("result");

const welcome = document.getElementById("welcome");

const errorBox = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const errorClose = document.getElementById("error-close");

const charCount = document.getElementById("char-count");
const modeLabel = document.getElementById("mode-label");
const inputTitle = document.getElementById("input-title");

const sampleBtn = document.getElementById("sample-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const themeBtn = document.getElementById("theme-btn");

const chatHistoryList =
    document.getElementById("chat-history-list");


// ============================================
// TASK DATA
// ============================================

const taskData = {

    qa: {
        name: "Ask Question",
        label: "Question",
        placeholder: "Ask anything...",
        sample: "What is artificial intelligence?"
    },

    explain: {
        name: "Explain Topic",
        label: "Topic",
        placeholder: "Enter a topic you want explained...",
        sample: "Explain object-oriented programming"
    },

    quiz: {
        name: "Generate Quiz",
        label: "Quiz Topic",
        placeholder: "Enter a topic for your quiz...",
        sample: "Create a quiz about Python"
    },

    summarize: {
        name: "Summarize",
        label: "Text",
        placeholder: "Paste the text you want summarized...",
        sample: "Summarize the concept of machine learning"
    },

    learn: {
        name: "Learning Path",
        label: "Learning Goal",
        placeholder: "What do you want to learn?",
        sample: "Create a learning path for SQL"
    }
};


// ============================================
// LOCAL STORAGE
// ============================================

function saveChats() {

    localStorage.setItem(
        "edugenie_chats",
        JSON.stringify(chats)
    );
}


function loadChats() {

    try {

        const saved =
            localStorage.getItem("edugenie_chats");

        if (saved) {

            chats = JSON.parse(saved);

        } else {

            chats = [];
        }

    } catch (error) {

        console.error(
            "Could not load chat history:",
            error
        );

        chats = [];
    }
}


// ============================================
// CREATE NEW CHAT
// ============================================

function createNewChat() {

    const chat = {

        id: Date.now().toString(),

        title: "New Chat",

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString(),

        messages: []

    };

    chats.unshift(chat);

    currentChatId = chat.id;

    saveChats();

    renderChatHistory();

    showEmptyChat();

    input.focus();
}


// ============================================
// GET CURRENT CHAT
// ============================================

function getCurrentChat() {

    return chats.find(
        chat => chat.id === currentChatId
    );
}


// ============================================
// SHOW EMPTY CHAT
// ============================================

function showEmptyChat() {

    result.innerHTML = "";

    resultArea.classList.add("hidden");

    welcome.classList.remove("hidden");

    hideError();

    input.value = "";

    updateCharacterCount();

    isSending = false;

    submitBtn.disabled = false;

    submitBtn.classList.remove("sending");
}


// ============================================
// LOAD CHAT
// ============================================

function loadChat(chatId) {

    const chat =
        chats.find(
            item => item.id === chatId
        );

    if (!chat) return;

    currentChatId = chatId;

    result.innerHTML = "";

    hideError();

    renderChatHistory();

    if (!chat.messages.length) {

        showEmptyChat();

        return;
    }

    welcome.classList.add("hidden");

    resultArea.classList.remove("hidden");

    chat.messages.forEach(message => {

        renderMessage(message);
    });

    setTimeout(() => {

        resultArea.scrollTop =
            resultArea.scrollHeight;

    }, 50);
}


// ============================================
// RENDER SIDEBAR HISTORY
// ============================================

function renderChatHistory() {

    if (!chatHistoryList) return;

    chatHistoryList.innerHTML = "";

    if (chats.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "history-empty";

        empty.textContent =
            "No previous chats";

        chatHistoryList.appendChild(empty);

        return;
    }


    chats.forEach(chat => {

        const item =
            document.createElement("div");

        item.className =
            "sidebar-chat";

        if (chat.id === currentChatId) {

            item.classList.add("active");
        }


        // Chat title
        const title =
            document.createElement("button");

        title.className =
            "sidebar-chat-title";

        title.textContent =
            chat.title || "New Chat";


        title.addEventListener(
            "click",
            () => {

                loadChat(chat.id);
            }
        );


        // Delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "sidebar-chat-delete";

        deleteButton.innerHTML =
            "×";

        deleteButton.title =
            "Delete chat";


        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteChat(chat.id);
            }
        );


        item.appendChild(title);

        item.appendChild(deleteButton);

        chatHistoryList.appendChild(item);
    });
}


// ============================================
// DELETE CHAT
// ============================================

function deleteChat(chatId) {

    const chat =
        chats.find(
            item => item.id === chatId
        );

    if (!chat) return;


    const confirmed =
        confirm(
            `Delete "${chat.title}"?`
        );

    if (!confirmed) return;


    chats =
        chats.filter(
            item => item.id !== chatId
        );


    saveChats();


    if (currentChatId === chatId) {

        if (chats.length > 0) {

            loadChat(chats[0].id);

        } else {

            currentChatId = null;

            createNewChat();
        }

    } else {

        renderChatHistory();
    }
}


// ============================================
// SELECT TASK
// ============================================

function selectTask(task) {

    if (!taskData[task]) return;

    selectedTask = task;

    const data = taskData[task];


    if (modeLabel) {

        modeLabel.textContent =
            data.name;
    }


    if (inputTitle) {

        inputTitle.textContent =
            data.label;
    }


    if (input) {

        input.placeholder =
            data.placeholder;
    }


    document
        .querySelectorAll("[data-task]")
        .forEach(button => {

            button.classList.remove("active");
        });


    const selectedButton =
        document.querySelector(
            `[data-task="${task}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("active");
    }
}


// ============================================
// CHARACTER COUNT
// ============================================

function updateCharacterCount() {

    if (!input || !charCount) return;

    charCount.textContent =
        `${input.value.length}/30000`;
}


// ============================================
// ERROR
// ============================================

function showError(message) {

    if (!errorBox || !errorMessage) return;

    errorMessage.textContent =
        message;

    errorBox.classList.remove("hidden");
}


function hideError() {

    if (errorBox) {

        errorBox.classList.add("hidden");
    }
}


// ============================================
// FORMAT AI RESPONSE
// ============================================

function formatAnswer(text) {

    if (!text) return "";

    let formatted = text;


    formatted = formatted
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    formatted = formatted.replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    );


    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    formatted = formatted.replace(
        /`([^`]+)`/g,
        "<code>$1</code>"
    );


    formatted = formatted.replace(
        /^### (.*)$/gm,
        "<h4>$1</h4>"
    );


    formatted = formatted.replace(
        /^## (.*)$/gm,
        "<h3>$1</h3>"
    );


    formatted = formatted.replace(
        /^# (.*)$/gm,
        "<h2>$1</h2>"
    );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;
}


// ============================================
// RENDER MESSAGE
// ============================================

function renderMessage(message) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "history-message";


    // USER
    const userSection =
        document.createElement("div");

    userSection.className =
        "history-user";


    userSection.innerHTML = `
        <div class="history-avatar user-avatar">
            You
        </div>

        <div class="history-content">

            <div class="history-label">
                You
                <span class="history-mode">
                    ${taskData[message.task]?.name || "EduGenie"}
                </span>
            </div>

            <div class="history-question"></div>

        </div>
    `;


    userSection
        .querySelector(".history-question")
        .textContent =
        message.question;


    // AI
    const aiSection =
        document.createElement("div");

    aiSection.className =
        "history-ai";


    aiSection.innerHTML = `
        <div class="history-avatar ai-avatar">
            ✦
        </div>

        <div class="history-content">

            <div class="history-label">
                EduGenie
            </div>

            <div class="history-answer"></div>

        </div>
    `;


    const answerElement =
        aiSection.querySelector(
            ".history-answer"
        );


    if (message.answer) {

        answerElement.innerHTML = `
            <div class="answer-text">
                ${formatAnswer(message.answer)}
            </div>

            <button
                class="history-copy"
                type="button">
                Copy
            </button>
        `;


        const copyButton =
            answerElement.querySelector(
                ".history-copy"
            );


        copyButton.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(
                            message.answer
                        );

                    copyButton.textContent =
                        "Copied!";


                    setTimeout(() => {

                        copyButton.textContent =
                            "Copy";

                    }, 1500);

                } catch {

                    copyButton.textContent =
                        "Failed";
                }
            }
        );

    } else {

        answerElement.innerHTML = `
            <div class="history-thinking">
                Thinking...
            </div>
        `;
    }


    wrapper.appendChild(userSection);

    wrapper.appendChild(aiSection);

    result.appendChild(wrapper);

    return wrapper;
}


// ============================================
// SEND TO GEMINI
// ============================================

async function askAI() {

    if (isSending) return;


    const text =
        input.value.trim();


    if (!text) {

        showError(
            "Please enter something first."
        );

        return;
    }


    hideError();


    // If no chat exists, create one
    if (!currentChatId) {

        createNewChat();
    }


    const chat =
        getCurrentChat();


    if (!chat) return;


    isSending = true;


    const submittedTask =
        selectedTask;


    // First question becomes chat title
    if (
        chat.messages.length === 0 ||
        chat.title === "New Chat"
    ) {

        chat.title =
            text.length > 35
                ? text.substring(0, 35) + "..."
                : text;
    }


    // Clear input
    input.value = "";

    updateCharacterCount();


    // Show conversation
    welcome.classList.add("hidden");

    resultArea.classList.remove("hidden");


    // Create message
    const message = {

        id: Date.now().toString(),

        question: text,

        task: submittedTask,

        answer: null,

        createdAt:
            new Date().toISOString()
    };


    chat.messages.push(message);

    chat.updatedAt =
        new Date().toISOString();


    saveChats();

    renderChatHistory();


    // Render immediately
    const messageElement =
        renderMessage(message);


    messageElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    submitBtn.disabled = true;

    submitBtn.classList.add("sending");


    try {

        const response =
            await fetch(
                "/api/ask",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        task: submittedTask,

                        prompt: text
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Something went wrong."
            );
        }


        const answer =
            data.result ||
            "No answer received.";


        // Save answer
        message.answer =
            answer;


        chat.updatedAt =
            new Date().toISOString();


        saveChats();


        // Update visible message
        const answerElement =
            messageElement.querySelector(
                ".history-answer"
            );


        answerElement.innerHTML = `
            <div class="answer-text">
                ${formatAnswer(answer)}
            </div>

            <button
                class="history-copy"
                type="button">
                Copy
            </button>
        `;


        const copyButton =
            answerElement.querySelector(
                ".history-copy"
            );


        copyButton.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(answer);

                    copyButton.textContent =
                        "Copied!";


                    setTimeout(() => {

                        copyButton.textContent =
                            "Copy";

                    }, 1500);

                } catch {

                    copyButton.textContent =
                        "Failed";
                }
            }
        );


        messageElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    } catch (error) {

        console.error(
            "EduGenie Error:",
            error
        );


        const answerElement =
            messageElement.querySelector(
                ".history-answer"
            );


        answerElement.innerHTML = `
            <div class="chat-error">
                <strong>Error</strong>
                <br>
                ${error.message}
            </div>
        `;

    } finally {

        isSending = false;

        submitBtn.disabled = false;

        submitBtn.classList.remove(
            "sending"
        );

        input.focus();
    }
}


// ============================================
// SAMPLE
// ============================================

function useSamplePrompt() {

    input.value =
        taskData[selectedTask]?.sample || "";

    updateCharacterCount();

    input.focus();
}


// ============================================
// THEME
// ============================================

function toggleTheme() {

    document.body.classList.toggle(
        "light-theme"
    );


    const isLight =
        document.body.classList.contains(
            "light-theme"
        );


    localStorage.setItem(
        "edugenie-theme",
        isLight
            ? "light"
            : "dark"
    );
}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "edugenie-theme"
        );


    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );
    }
}


// ============================================
// EVENTS
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadChats();

        loadTheme();


        // If saved chats exist,
        // open the latest one.
        if (chats.length > 0) {

            currentChatId =
                chats[0].id;

            loadChat(
                currentChatId
            );

        } else {

            createNewChat();
        }


        // Tools
        document
            .querySelectorAll("[data-task]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectTask(
                            button.getAttribute(
                                "data-task"
                            )
                        );
                    }
                );
            });


        // Send
        submitBtn.addEventListener(
            "click",
            askAI
        );


        // Input
        input.addEventListener(
            "input",
            updateCharacterCount
        );


        // Ctrl + Enter
        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    event.ctrlKey
                ) {

                    event.preventDefault();

                    askAI();
                }
            }
        );


        // New Chat
        newChatBtn.addEventListener(
            "click",
            createNewChat
        );


        // Sample
        if (sampleBtn) {

            sampleBtn.addEventListener(
                "click",
                useSamplePrompt
            );
        }


        // Theme
        if (themeBtn) {

            themeBtn.addEventListener(
                "click",
                toggleTheme
            );
        }


        // Close error
        if (errorClose) {

            errorClose.addEventListener(
                "click",
                hideError
            );
        }


        selectTask("qa");

        updateCharacterCount();
    }
);