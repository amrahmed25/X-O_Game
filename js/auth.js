const SUPABASE_URL = "https://rxtltbxofpydthukesin.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UqBYM7pB48fGfvIPvoPO3g_OQkizOzJ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
const messageDivCSS = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 0.8;
        }
    }

    #messageDiv {
        justify-content: center;
        align-items: center;
        opacity: 0.8;
        background-color: var(--button-color);
        border-radius: 0.75rem;
        height: 8rem;
        width: 33rem;
        box-shadow: 0 15px 50px -12px #172c5fc5;
        animation: fadeIn 1s ease;
    }
`;

const stylemessageDiv = document.createElement("style");

stylemessageDiv.textContent = messageDivCSS;

document.head.appendChild(stylemessageDiv);

async function whenSubmit(e) {

    e.preventDefault();

    const nameInput =
        document.getElementById("name").value.trim();

    const emailInput =
        document.getElementById("email").value.trim();

    const passwordInput =
        document.getElementById("password").value;

    const greetingMessage =
        document.getElementById("greeting");

    const messageDiv =
        document.getElementById("messageDiv");

    const messagePlace =
        document.getElementById("message");


    function showMessage(message) {

        messageDiv.style.display = "flex";

        messagePlace.textContent = message;
    }


    const isRegister =
        greetingMessage.innerText === "Sign Up for Games Station";
    if (isRegister) {

        if (!nameInput) {

            showMessage("Please enter your name.");

            return;
        }


        showMessage("Creating your account...");


        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email: emailInput,

            password: passwordInput,

            options: {

                data: {
                    username: nameInput
                }

            }

        });


        if (error) {

            console.error(error);

            showMessage(error.message);

            return;
        }


        console.log("Registered user:", data.user);


        if (!data.session) {

            showMessage(
                "Account created successfully. Please check your email to confirm your account."
            );

            setTimeout(() => {

                window.location.href = "index.html";

            }, 4000);

            return;
        }


        showMessage(
            "Register successful. Redirecting you now to Login page"
        );


        setTimeout(() => {

            window.location.href = "index.html";

        }, 3000);

    }

    else {

        showMessage("Logging in...");


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: emailInput,

            password: passwordInput

        });


        if (error) {

            console.error(error);

            showMessage(error.message);

            return;
        }


        console.log("Logged in user:", data.user);


        showMessage(
            "Login successful. Redirecting you now to Home page"
        );


        setTimeout(() => {

            window.location.href = "xo.html";

        }, 2000);

    }

}



const mainContent = document.getElementById("mainContent");
const gameInfo = document.getElementById("gameInfo");
const systemStatus = document.getElementById("systemStatus");
const enterBtn = document.getElementById("enterBtn");
const startScreen = document.getElementById("startScreen");
const characterScreen = document.getElementById("characterScreen");
const playerSetup = document.getElementById("playerSetup");
const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");
const continueBtn = document.getElementById("continueBtn");
const setupMessage = document.getElementById("setupMessage");
const gameBoard = document.getElementById("gameBoard");
const board = document.getElementById("board");
const boardPlayer1 = document.getElementById("boardPlayer1");
const boardPlayer2 = document.getElementById("boardPlayer2");
const turnText = document.getElementById("turnText");
const turnDot = document.getElementById("turnDot");
const resetGame = document.getElementById("resetGame");
const exitArena = document.getElementById("exitArena");
const winnerOverlay = document.getElementById("winnerOverlay");
const winnerTitle = document.getElementById("winnerTitle");
const winnerName = document.getElementById("winnerName");
const overlayRematch = document.getElementById("overlayRematch");

// ============================================================
// OFFLINE MODE: Game state (UNMODIFIED)
// ============================================================
let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

// ============================================================
// ONLINE MODE: DOM references (NEW for Supabase)
// ============================================================
const modeSelect = document.getElementById("modeSelect");
const offlineModeBtn = document.getElementById("offlineModeBtn");
const onlineModeBtn = document.getElementById("onlineModeBtn");
const onlineBackBtn = document.getElementById("onlineBackBtn");

const onlineSetup = document.getElementById("onlineSetup");
const onlineName = document.getElementById("onlineName");
const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const joinRoomCodeInput = document.getElementById("joinRoomCodeInput");
const joinRoomCodeSection = document.getElementById("joinRoomCodeSection");
const submitRoomCodeBtn = document.getElementById("submitRoomCodeBtn");
const onlineSetupMessage = document.getElementById("onlineSetupMessage");
const onlineWaitingPanel = document.getElementById("onlineWaitingPanel");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const cancelWaitingBtn = document.getElementById("cancelWaitingBtn");

const onlineBoardScreen = document.getElementById("onlineBoardScreen");
const onlineBoardEl = document.getElementById("onlineBoardEl");
const onlineBoardPlayer1 = document.getElementById("onlineBoardPlayer1");
const onlineBoardPlayer2 = document.getElementById("onlineBoardPlayer2");
const onlineTurnText = document.getElementById("onlineTurnText");
const onlineTurnDot = document.getElementById("onlineTurnDot");
const onlineTimer1 = document.getElementById("onlineTimer1");
const onlineTimer2 = document.getElementById("onlineTimer2");
const onlineStatusMsg = document.getElementById("onlineStatusMsg");
const onlineRematchBtn = document.getElementById("onlineRematchBtn");
const onlineExitBtn = document.getElementById("onlineExitBtn");
const onlineWinnerOverlay = document.getElementById("onlineWinnerOverlay");
const onlineWinnerTitle = document.getElementById("onlineWinnerTitle");
const onlineWinnerName = document.getElementById("onlineWinnerName");
const onlineWinnerReason = document.getElementById("onlineWinnerReason");
const onlineOverlayRematch = document.getElementById("onlineOverlayRematch");

// ============================================================
// ONLINE MODE: Game state (NEW for Supabase)
// ============================================================
let onlineGameState = {
    playerId: null,
    playerName: null,
    roomId: null,
    roomCode: null,
    isHost: false,
    mySymbol: null,
    board: ["", "", "", "", "", "", "", "", ""],
    currentTurn: "X",
    playerXId: null,
    playerOId: null,
    playerXName: null,
    playerOName: null,
    playerXTime: 60,
    playerOTime: 60,
    gameStatus: "waiting", // waiting, playing, finished
    winner: null,
    turnStartedAt: null,
    realtimeSubscription: null,
    timerInterval: null
};

// ============================================================
// OFFLINE MODE: Window load animation (UNMODIFIED)
// ============================================================
window.addEventListener("load", function () {
    setTimeout(function () {
        if (mainContent) mainContent.classList.remove("opacity-0", "translate-y-8");
    }, 250);

    setTimeout(function () {
        if (gameInfo) gameInfo.classList.remove("opacity-0", "-translate-x-8");
        if (systemStatus) systemStatus.classList.remove("opacity-0", "translate-x-8");
    }, 600);
});

// ============================================================
// OFFLINE MODE: Start screen -> Character screen (UNMODIFIED)
// ============================================================
enterBtn.addEventListener("click", function () {
    startScreen.classList.add("opacity-0", "scale-105", "transition-all", "duration-700");
    setTimeout(function () {
        startScreen.classList.add("hidden");
        characterScreen.classList.remove("hidden");
        characterScreen.classList.add("flex");
    }, 700);
});

// ============================================================
// OFFLINE MODE: Character screen -> Mode select (CHANGED to go to mode select)
// ============================================================
characterScreen.addEventListener("click", function () {
    characterScreen.classList.add("opacity-0", "scale-105", "transition-all", "duration-700");
    setTimeout(function () {
        characterScreen.classList.add("hidden");
        modeSelect.classList.remove("hidden");
        modeSelect.classList.add("flex");
    }, 700);
});

// ============================================================
// MODE SELECT: Offline vs Online
// ============================================================
offlineModeBtn.addEventListener("click", function () {
    modeSelect.classList.add("hidden");
    modeSelect.classList.remove("flex");
    playerSetup.classList.remove("hidden");
    playerSetup.classList.add("flex");
});

onlineModeBtn.addEventListener("click", function () {
    modeSelect.classList.add("hidden");
    modeSelect.classList.remove("flex");
    onlineSetup.classList.remove("hidden");
    onlineSetup.classList.add("flex");
});

onlineBackBtn.addEventListener("click", function () {
    onlineSetup.classList.add("hidden");
    onlineSetup.classList.remove("flex");
    modeSelect.classList.remove("hidden");
    modeSelect.classList.add("flex");
    joinRoomCodeSection.classList.add("hidden");
});

// ============================================================
// OFFLINE MODE: Continue to game (UNMODIFIED)
// ============================================================
continueBtn.addEventListener("click", function () {
    const name1 = player1Name.value.trim();
    const name2 = player2Name.value.trim();

    if (name1 === "" || name2 === "") {
        setupMessage.classList.remove("opacity-0");
        return;
    }

    setupMessage.classList.add("opacity-0");

    localStorage.setItem("player1Name", name1);
    localStorage.setItem("player2Name", name2);
    localStorage.setItem("player1Symbol", "X");
    localStorage.setItem("player2Symbol", "O");

    playerSetup.classList.add("hidden");
    playerSetup.classList.remove("flex");

    gameBoard.classList.remove("hidden");
    gameBoard.classList.add("flex");

    loadPlayers();
    createBoard();
});

// ============================================================
// ONLINE MODE: Create Room
// ============================================================
createRoomBtn.addEventListener("click", async function () {
    const name = onlineName.value.trim();
    if (name === "") {
        onlineSetupMessage.classList.remove("opacity-0");
        return;
    }

    createRoomBtn.disabled = true;
    createRoomBtn.textContent = "Creating...";

    try {
        // Create or upsert player
       const { data: playerData, error: playerError } = await supabaseClient.from("players")
            .insert([{ userName: name }])
            .select()
            .single();

        if (playerError) throw playerError;

        onlineGameState.playerId = playerData.id;
        onlineGameState.playerName = name;
        onlineGameState.isHost = true;
        onlineGameState.mySymbol = "X";

        // Generate unique room code
        const roomCode = generateRoomCode();

        // Create room
        const { data: roomData, error: roomError } = await supabase
            .from("rooms")
            .insert([{
                roomCode: roomCode,
                playerX: playerData.id,
                hostId: playerData.id,
                playerO: null,
                board: JSON.stringify(["", "", "", "", "", "", "", "", ""]),
                currentTurn: "X",
                playerXTime: 60,
                playerOTime: 60,
                turnStartedAt: null,
                status: "waiting",
                winner: null
            }])
            .select()
            .single();

        if (roomError) throw roomError;

        onlineGameState.roomId = roomData.id;
        onlineGameState.roomCode = roomCode;
        onlineGameState.playerXId = playerData.id;
        onlineGameState.playerXName = name;

        // Show waiting panel
        roomCodeDisplay.textContent = roomCode;
        onlineSetup.classList.add("hidden");
        onlineSetup.classList.remove("flex");
        onlineWaitingPanel.classList.remove("hidden");
        onlineWaitingPanel.classList.add("flex");

        // Subscribe to room changes
        subscribeToRoom(roomData.id);

    } catch (error) {
        console.error("Error creating room:", error);
        onlineSetupMessage.textContent = "Error creating room. Try again.";
        onlineSetupMessage.classList.remove("opacity-0");
        createRoomBtn.disabled = false;
        createRoomBtn.textContent = "Create Room";
    }
});

// ============================================================
// ONLINE MODE: Join Room
// ============================================================
joinRoomBtn.addEventListener("click", function () {
    joinRoomCodeSection.classList.remove("hidden");
});

submitRoomCodeBtn.addEventListener("click", async function () {
    const code = joinRoomCodeInput.value.trim().toUpperCase();
    const name = onlineName.value.trim();

    if (name === "" || code === "") {
        onlineSetupMessage.classList.remove("opacity-0");
        return;
    }

    submitRoomCodeBtn.disabled = true;
    submitRoomCodeBtn.textContent = "Joining...";

    try {
        // Create or upsert player
        const { data: playerData, error: playerError } = await supabase
            .from("players")
            .insert([{ userName: name }])
            .select()
            .single();

        if (playerError) throw playerError;

        // Find room by code
        const { data: roomData, error: roomError } = await supabase
            .from("rooms")
            .select("*")
            .eq("roomCode", code)
            .single();

        if (roomError || !roomData) {
            throw new Error("Room not found.");
        }

        if (roomData.status !== "waiting") {
            throw new Error("Room is not waiting for a player.");
        }

        onlineGameState.playerId = playerData.id;
        onlineGameState.playerName = name;
        onlineGameState.isHost = false;
        onlineGameState.mySymbol = "O";
        onlineGameState.roomId = roomData.id;
        onlineGameState.roomCode = code;
        onlineGameState.playerOId = playerData.id;
        onlineGameState.playerOName = name;
        onlineGameState.playerXId = roomData.playerX;

        // Update room: set playerO and status to playing
        const now = new Date().toISOString();
        const { error: updateError } = await supabase
            .from("rooms")
            .update({
                playerO: playerData.id,
                status: "playing",
                currentTurn: "X",
                playerXTime: 60,
                playerOTime: 60,
                turnStartedAt: now
            })
            .eq("id", roomData.id);

        if (updateError) throw updateError;

        onlineSetup.classList.add("hidden");
        onlineSetup.classList.remove("flex");
        onlineBoardScreen.classList.remove("hidden");
        onlineBoardScreen.classList.add("flex");

        // Subscribe to room changes
        subscribeToRoom(roomData.id);

        // Start timer update loop
        startTimerUpdate();

    } catch (error) {
        console.error("Error joining room:", error);
        onlineSetupMessage.textContent = error.message || "Error joining room. Try again.";
        onlineSetupMessage.classList.remove("opacity-0");
        submitRoomCodeBtn.disabled = false;
        submitRoomCodeBtn.textContent = "Submit Code";
    }
});

// ============================================================
// ONLINE MODE: Cancel waiting
// ============================================================
cancelWaitingBtn.addEventListener("click", async function () {
    if (onlineGameState.roomId) {
        try {
            await supabase.from("rooms").delete().eq("id", onlineGameState.roomId);
        } catch (e) {
            console.error("Error canceling room:", e);
        }
    }
    resetOnlineState();
    onlineWaitingPanel.classList.add("hidden");
    onlineWaitingPanel.classList.remove("flex");
    onlineSetup.classList.remove("hidden");
    onlineSetup.classList.add("flex");
    onlineName.value = "";
    joinRoomCodeSection.classList.add("hidden");
});

// ============================================================
// ONLINE MODE: Realtime subscription
// ============================================================
function subscribeToRoom(roomId) {
    // Unsubscribe from previous if exists
    if (onlineGameState.realtimeSubscription) {
        onlineGameState.realtimeSubscription.unsubscribe();
    }

    // Subscribe to room changes
    const subscription = supabase
        .channel(`room:${roomId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "rooms",
                filter: `id=eq.${roomId}`
            },
            (payload) => {
                handleRoomUpdate(payload.new);
            }
        )
        .subscribe();

    onlineGameState.realtimeSubscription = subscription;
}

// ============================================================
// ONLINE MODE: Handle room updates
// ============================================================
async function handleRoomUpdate(room) {
    if (!room) return;

    // Update local state from database
    onlineGameState.board = JSON.parse(room.board || "[]");
    onlineGameState.currentTurn = room.currentTurn;
    onlineGameState.playerXTime = room.playerXTime;
    onlineGameState.playerOTime = room.playerOTime;
    onlineGameState.gameStatus = room.status;
    onlineGameState.winner = room.winner;
    onlineGameState.turnStartedAt = room.turnStartedAt;

    // Load player X name if not loaded
    if (!onlineGameState.playerXName && room.playerX) {
        const { data } = await supabase
            .from("players")
            .select("userName")
            .eq("id", room.playerX)
            .single();
        if (data) onlineGameState.playerXName = data.userName;
    }

    // Load player O name if not loaded
    if (!onlineGameState.playerOName && room.playerO) {
        const { data } = await supabase
            .from("players")
            .select("userName")
            .eq("id", room.playerO)
            .single();
        if (data) onlineGameState.playerOName = data.userName;
    }

    // If waiting and both players joined, show board
    if (onlineGameState.gameStatus === "waiting" && room.playerO && onlineWaitingPanel.classList.contains("hidden") === false) {
        onlineWaitingPanel.classList.add("hidden");
        onlineWaitingPanel.classList.remove("flex");
        onlineBoardScreen.classList.remove("hidden");
        onlineBoardScreen.classList.add("flex");
        startTimerUpdate();
    }

    // If game is playing, show board
    if (onlineGameState.gameStatus === "playing") {
        if (onlineBoardScreen.classList.contains("hidden")) {
            onlineBoardScreen.classList.remove("hidden");
            onlineBoardScreen.classList.add("flex");
            onlineWaitingPanel.classList.add("hidden");
            onlineWaitingPanel.classList.remove("flex");
        }

        renderOnlineBoard();
        updateOnlineUI();

        if (onlineGameState.gameStatus === "playing") {
            startTimerUpdate();
        }
    }

    // If game is finished
    if (onlineGameState.gameStatus === "finished" && onlineGameState.winner) {
        clearInterval(onlineGameState.timerInterval);
        showOnlineGameResult();
    }
}

// ============================================================
// ONLINE MODE: Render board
// ============================================================
function renderOnlineBoard() {
    if (onlineBoardEl.children.length === 0) {
        // Create cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            cell.type = "button";
            cell.dataset.index = i;
            cell.className = `
                border border-white/[0.15] bg-black/40 backdrop-blur-sm
                text-5xl md:text-6xl font-black
                transition-all duration-200
                hover:bg-white/[0.05] hover:border-white/30
                disabled:cursor-not-allowed
            `;
            cell.addEventListener("click", () => onlineCellClick(i));
            onlineBoardEl.appendChild(cell);
        }
    }

    // Update cells
    onlineGameState.board.forEach((symbol, index) => {
        const cell = onlineBoardEl.children[index];
        cell.textContent = symbol;
        cell.disabled = symbol !== "" || onlineGameState.gameStatus !== "playing" || onlineGameState.currentTurn !== onlineGameState.mySymbol;
        cell.className = `
            border bg-black/40 backdrop-blur-sm
            text-5xl md:text-6xl font-black
            transition-all duration-200
            disabled:cursor-not-allowed
        `;

        if (symbol === "X") {
            cell.classList.add("text-purple-500", "border-purple-500/30", "drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]");
        } else if (symbol === "O") {
            cell.classList.add("text-blue-500", "border-blue-500/30", "drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]");
        } else {
            cell.classList.add("border-white/[0.15]", "hover:bg-white/[0.05]", "hover:border-white/30");
        }
    });
}

// ============================================================
// ONLINE MODE: Update UI
// ============================================================
function updateOnlineUI() {
    // Update player names
    onlineBoardPlayer1.textContent = onlineGameState.playerXName || "PLAYER 01";
    onlineBoardPlayer2.textContent = onlineGameState.playerOName || "PLAYER 02";

    // Update turn indicator
    if (onlineGameState.currentTurn === "X") {
        onlineTurnText.textContent = "X'S TURN";
        onlineTurnText.className = "text-[9px] md:text-xs font-bold tracking-[0.25em] text-purple-400 uppercase whitespace-nowrap";
        onlineTurnDot.className = "w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)] animate-pulse";
    } else {
        onlineTurnText.textContent = "O'S TURN";
        onlineTurnText.className = "text-[9px] md:text-xs font-bold tracking-[0.25em] text-blue-400 uppercase whitespace-nowrap";
        onlineTurnDot.className = "w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] animate-pulse";
    }

    // Update status message
    onlineStatusMsg.textContent = onlineGameState.currentTurn === onlineGameState.mySymbol ? "YOUR MOVE" : "WAITING...";

    // Update timers
    updateOnlineTimerDisplay();
}

// ============================================================
// ONLINE MODE: Timer calculation and display
// ============================================================
function startTimerUpdate() {
    clearInterval(onlineGameState.timerInterval);

    onlineGameState.timerInterval = setInterval(() => {
        updateOnlineTimerDisplay();

        // Check for timeout
        if (onlineGameState.playerXTime <= 0 || onlineGameState.playerOTime <= 0) {
            clearInterval(onlineGameState.timerInterval);
            // Timeout is handled by the host via database
        }
    }, 100); // Update every 100ms for smooth display
}

function updateOnlineTimerDisplay() {
    const now = Date.now();
    const turnStartedAtTime = onlineGameState.turnStartedAt ? new Date(onlineGameState.turnStartedAt).getTime() : now;
    const elapsedMs = now - turnStartedAtTime;

    let displayXTime = onlineGameState.playerXTime;
    let displayOTime = onlineGameState.playerOTime;

    // If it's currently X's turn, subtract elapsed time from X's remaining time
    if (onlineGameState.currentTurn === "X") {
        displayXTime = Math.max(0, onlineGameState.playerXTime - Math.floor(elapsedMs / 1000));
    } else {
        // If it's O's turn, subtract elapsed time from O's remaining time
        displayOTime = Math.max(0, onlineGameState.playerOTime - Math.floor(elapsedMs / 1000));
    }

    onlineTimer1.textContent = formatTime(displayXTime);
    onlineTimer2.textContent = formatTime(displayOTime);

    // Color change for low time
    onlineTimer1.classList.toggle("text-red-500", displayXTime <= 10 && onlineGameState.currentTurn === "X");
    onlineTimer2.classList.toggle("text-red-500", displayOTime <= 10 && onlineGameState.currentTurn === "O");
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================
// ONLINE MODE: Cell click
// ============================================================
async function onlineCellClick(index) {
    // Prevent move if not your turn
    if (onlineGameState.currentTurn !== onlineGameState.mySymbol) return;
    if (onlineGameState.gameStatus !== "playing") return;
    if (onlineGameState.board[index] !== "") return;

    try {
        // Make move in database
        const newBoard = [...onlineGameState.board];
        newBoard[index] = onlineGameState.mySymbol;

        const nextTurn = onlineGameState.mySymbol === "X" ? "O" : "X";
        const now = new Date().toISOString();

        // Check for win
        const result = checkWinner(newBoard);

        const { error } = await supabase
            .from("rooms")
            .update({
                board: JSON.stringify(newBoard),
                currentTurn: result ? "X" : nextTurn, // Don't change turn if game ends
                turnStartedAt: result ? onlineGameState.turnStartedAt : now,
                status: result ? "finished" : "playing",
                winner: result ? (
                    result.winner === "draw" 
                        ? null 
                        : (result.winner === "X" ? onlineGameState.playerXId : onlineGameState.playerOId)
                ) : null
            })
            .eq("id", onlineGameState.roomId);

        if (error) throw error;

    } catch (error) {
        console.error("Error making move:", error);
    }
}

// ============================================================
// ONLINE MODE: Check winner
// ============================================================
function checkWinner(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], pattern: line };
        }
    }

    if (board.every(cell => cell !== "")) {
        return { winner: "draw", pattern: null };
    }

    return null;
}

// ============================================================
// ONLINE MODE: Show game result
// ============================================================
function showOnlineGameResult() {
    const result = checkWinner(onlineGameState.board);

    if (result && result.winner === "draw") {
        onlineWinnerTitle.textContent = "STALEMATE";
        onlineWinnerTitle.className = "mt-4 text-4xl md:text-6xl font-black tracking-[0.08em] text-white";
        onlineWinnerName.textContent = "THE GRID REMAINS UNCLAIMED";
        onlineWinnerReason.textContent = "";
    } else if (result) {
        const isXWinner = result.winner === "X";
        const winnerName = isXWinner ? onlineGameState.playerXName : onlineGameState.playerOName;

        onlineWinnerTitle.textContent = result.winner;
        onlineWinnerTitle.className = isXWinner
            ? "mt-4 text-5xl md:text-7xl font-black tracking-[0.08em] text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.9)]"
            : "mt-4 text-5xl md:text-7xl font-black tracking-[0.08em] text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.9)]";

        onlineWinnerName.textContent = winnerName || "PLAYER";
        onlineWinnerReason.textContent = "HAS WON THE ROUND";
    }

    onlineWinnerOverlay.classList.remove("hidden");
    onlineWinnerOverlay.classList.add("flex");
}

// ============================================================
// ONLINE MODE: Rematch
// ============================================================
async function requestOnlineRematch() {
    try {
        const now = new Date().toISOString();
        const { error } = await supabase
            .from("rooms")
            .update({
                board: JSON.stringify(["", "", "", "", "", "", "", "", ""]),
                currentTurn: "X",
                playerXTime: 60,
                playerOTime: 60,
                turnStartedAt: now,
                status: "playing",
                winner: null
            })
            .eq("id", onlineGameState.roomId);

        if (error) throw error;

        onlineWinnerOverlay.classList.add("hidden");
        onlineWinnerOverlay.classList.remove("flex");

    } catch (error) {
        console.error("Error starting rematch:", error);
    }
}

onlineRematchBtn.addEventListener("click", requestOnlineRematch);
onlineOverlayRematch.addEventListener("click", requestOnlineRematch);

// ============================================================
// ONLINE MODE: Exit arena
// ============================================================
onlineExitBtn.addEventListener("click", function () {
    resetOnlineState();
    onlineBoardScreen.classList.add("hidden");
    onlineBoardScreen.classList.remove("flex");
    modeSelect.classList.remove("hidden");
    modeSelect.classList.add("flex");
});

function resetOnlineState() {
    clearInterval(onlineGameState.timerInterval);
    if (onlineGameState.realtimeSubscription) {
        onlineGameState.realtimeSubscription.unsubscribe();
    }
    onlineGameState = {
        playerId: null,
        playerName: null,
        roomId: null,
        roomCode: null,
        isHost: false,
        mySymbol: null,
        board: ["", "", "", "", "", "", "", "", ""],
        currentTurn: "X",
        playerXId: null,
        playerOId: null,
        playerXName: null,
        playerOName: null,
        playerXTime: 60,
        playerOTime: 60,
        gameStatus: "waiting",
        winner: null,
        turnStartedAt: null,
        realtimeSubscription: null,
        timerInterval: null
    };
    onlineBoardEl.innerHTML = "";
    onlineName.value = "";
    joinRoomCodeInput.value = "";
    joinRoomCodeSection.classList.add("hidden");
}

// ============================================================
// UTILITY: Generate room code
// ============================================================
function generateRoomCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ============================================================
// OFFLINE MODE: Game logic (UNMODIFIED from original)
// These functions are the original offline game logic and have not been changed
// ============================================================

function loadPlayers() {
    const name1 = localStorage.getItem("player1Name") || "Player 1";
    const name2 = localStorage.getItem("player2Name") || "Player 2";
    boardPlayer1.textContent = name1;
    boardPlayer2.textContent = name2;
}

function createBoard() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = `
            border border-white/[0.15]
            bg-black/40
            backdrop-blur-sm
            text-5xl
            md:text-6xl
            font-black
            transition-all
            duration-200
            hover:bg-white/[0.05]
            hover:border-white/30
            disabled:cursor-not-allowed
        `;
        cell.addEventListener("click", function () {
            makeMove(i);
        });
        board.appendChild(cell);
    }

    updateBoardDisplay();
}

function makeMove(index) {
    if (gameState[index] !== "" || gameOver) return;

    gameState[index] = currentPlayer;
    updateBoardDisplay();

    const winner = checkGame(gameState);
    if (winner) {
        finishGame(winner);
    } else {
        switchTurn();
    }
}

function updateBoardDisplay() {
    const cells = board.querySelectorAll("button");

    cells.forEach((cell, index) => {
        cell.textContent = gameState[index];
        cell.className = `
            border
            bg-black/40
            backdrop-blur-sm
            text-5xl
            md:text-6xl
            font-black
            transition-all
            duration-200
            disabled:cursor-not-allowed
        `;

        if (gameState[index] === "X") {
            cell.classList.add(
                "text-purple-500",
                "border-purple-500/30",
                "drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            );
            cell.disabled = true;
        } else if (gameState[index] === "O") {
            cell.classList.add(
                "text-blue-500",
                "border-blue-500/30",
                "drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            );
            cell.disabled = true;
        } else {
            cell.classList.add(
                "border-white/[0.15]",
                "hover:bg-white/[0.05]",
                "hover:border-white/30"
            );
            cell.disabled = false;
        }
    });

    updateTurnDisplay();
}

function switchTurn() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnDisplay();
}

function updateTurnDisplay() {
    if (currentPlayer === "X") {
        turnText.textContent = "X's Turn";
        turnText.className =
            "text-[10px] md:text-xs font-bold tracking-[0.25em] text-purple-400 uppercase";
        turnDot.className =
            "mt-2 w-2 h-2 rounded-full bg-purple-500 mx-auto shadow-[0_0_15px_rgba(168,85,247,1)] animate-pulse";
    } else {
        turnText.textContent = "O's Turn";
        turnText.className =
            "text-[10px] md:text-xs font-bold tracking-[0.25em] text-blue-400 uppercase";
        turnDot.className =
            "mt-2 w-2 h-2 rounded-full bg-blue-500 mx-auto shadow-[0_0_15px_rgba(59,130,246,1)] animate-pulse";
    }
}

function checkGame(state) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return { winner: state[a], pattern: line };
        }
    }

    if (state.every(cell => cell !== "")) {
        return { winner: "draw", pattern: null };
    }

    return null;
}

function finishGame(result) {
    gameOver = true;

    const cells = board.querySelectorAll("button");
    cells.forEach(cell => (cell.disabled = true));

    if (result.pattern) {
        result.pattern.forEach(index => {
            const cell = board.children[index];
            cell.classList.add("bg-white/[0.08]", "scale-105");
            if (result.winner === "X") {
                cell.classList.add("border-purple-500");
            } else {
                cell.classList.add("border-blue-500");
            }
        });
    }

    if (result.winner === "draw") {
        winnerTitle.textContent = "DRAW";
        winnerTitle.className =
            "mt-5 text-5xl md:text-8xl font-black tracking-[0.08em] text-white";
        winnerName.textContent = "THE GRID REMAINS UNCLAIMED";
    } else {
        const name = result.winner === "X"
            ? boardPlayer1.textContent
            : boardPlayer2.textContent;
        winnerTitle.textContent = result.winner;
        winnerTitle.className =
            result.winner === "X"
                ? "mt-5 text-6xl md:text-8xl font-black tracking-[0.08em] text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.9)]"
                : "mt-5 text-6xl md:text-8xl font-black tracking-[0.08em] text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.9)]";
        winnerName.textContent = name;
    }

    winnerOverlay.classList.remove("hidden");
    winnerOverlay.classList.add("flex");
}

resetGame.addEventListener("click", function () {
    winnerOverlay.classList.add("hidden");
    winnerOverlay.classList.remove("flex");
    createBoard();
});

exitArena.addEventListener("click", function () {
    gameBoard.classList.add("hidden");
    gameBoard.classList.remove("flex");
    modeSelect.classList.remove("hidden");
    modeSelect.classList.add("flex");
});

overlayRematch.addEventListener("click", function () {
    winnerOverlay.classList.add("hidden");
    winnerOverlay.classList.remove("flex");
    createBoard();
});