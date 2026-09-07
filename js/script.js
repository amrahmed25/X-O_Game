        const mainContent =
            document.getElementById("mainContent");

        const gameInfo =
            document.getElementById("gameInfo");

        const systemStatus =
            document.getElementById("systemStatus");

        const enterBtn =
            document.getElementById("enterBtn");

        const startScreen =
            document.getElementById("startScreen");

        const characterScreen =
            document.getElementById("characterScreen");


        

        const playerSetup =
            document.getElementById("playerSetup");

        const player1Name =
            document.getElementById("player1Name");

        const player2Name =
            document.getElementById("player2Name");

        const continueBtn =
            document.getElementById("continueBtn");

        const setupMessage =
            document.getElementById("setupMessage");


            const gameBoard =
    document.getElementById("gameBoard");

const board =
    document.getElementById("board");

const boardPlayer1 =
    document.getElementById("boardPlayer1");

const boardPlayer2 =
    document.getElementById("boardPlayer2");

const turnText =
    document.getElementById("turnText");

const turnDot =
    document.getElementById("turnDot");

const resetGame =
    document.getElementById("resetGame");

const exitArena =
    document.getElementById("exitArena");

const winnerOverlay =
    document.getElementById("winnerOverlay");

const winnerTitle =
    document.getElementById("winnerTitle");

const winnerName =
    document.getElementById("winnerName");

const overlayRematch =
    document.getElementById("overlayRematch");


        

        window.addEventListener(
            "load",
            function () {

                setTimeout(
                    function () {

                        mainContent.classList.remove(
                            "opacity-0",
                            "translate-y-8"
                        );

                    },
                    250
                );


                setTimeout(
                    function () {

                        gameInfo.classList.remove(
                            "opacity-0",
                            "-translate-x-8"
                        );

                        systemStatus.classList.remove(
                            "opacity-0",
                            "translate-x-8"
                        );

                    },
                    600
                );

            }
        );


        

        enterBtn.addEventListener(
            "click",
            function () {

                startScreen.classList.add(
                    "opacity-0",
                    "scale-105",
                    "transition-all",
                    "duration-700"
                );


                setTimeout(
                    function () {

                        startScreen.classList.add(
                            "hidden"
                        );

                        characterScreen.classList.remove(
                            "hidden"
                        );

                        characterScreen.classList.add(
                            "flex"
                        );

                    },
                    700
                );

            }
        );


        

        characterScreen.addEventListener(
            "click",
            function () {

                characterScreen.classList.add(
                    "opacity-0",
                    "scale-105",
                    "transition-all",
                    "duration-700"
                );


                setTimeout(
                    function () {

                        characterScreen.classList.add(
                            "hidden"
                        );

                        playerSetup.classList.remove(
                            "hidden"
                        );

                        playerSetup.classList.add(
                            "flex"
                        );

                    },
                    700
                );

            }
        );


        

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

    playerSetup.classList.add(
        "hidden"
    );

    playerSetup.classList.remove(
        "flex"
    );

    gameBoard.classList.remove(
        "hidden"
    );

    gameBoard.classList.add(
        "flex"
    );

    loadPlayers();
    createBoard();

});











function loadPlayers() {

    const name1 =
        localStorage.getItem("player1Name")
        || "PLAYER 01";

    const name2 =
        localStorage.getItem("player2Name")
        || "PLAYER 02";


    boardPlayer1.textContent =
        name1;

    boardPlayer2.textContent =
        name2;

}





function createBoard() {

    board.innerHTML = "";


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const cell =
            document.createElement("button");


        cell.type =
            "button";


        cell.dataset.index =
            i;


        cell.className =
            "group relative flex items-center justify-center " +
            "border border-white/[0.10] " +
            "bg-black/35 backdrop-blur-sm " +
            "transition-all duration-300 " +
            "hover:bg-white/[0.04] " +
            "hover:border-white/[0.25] " +
            "hover:scale-[1.02]";


        cell.innerHTML = `

            <span
                class="
                absolute
                inset-0
                opacity-0
                transition-all
                duration-300
                group-hover:opacity-100
                bg-gradient-to-br
                from-purple-500/10
                to-blue-500/10
                ">
            </span>

        `;


        cell.addEventListener(
            "click",
            function () {

                makeMove(i);

            }
        );


        board.appendChild(cell);

    }

}





function makeMove(index) {

    if (
        gameState[index] !== ""
        ||
        gameOver
    ) {

        return;

    }


    gameState[index] =
        currentPlayer;


    const cell =
        board.children[index];


    const symbol =
        document.createElement("span");


    symbol.textContent =
        currentPlayer;


    if (
        currentPlayer === "X"
    ) {

        symbol.className =
            "relative z-10 text-6xl md:text-7xl font-black " +
            "text-purple-500 " +
            "drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] " +
            "animate-pulse";

    } else {

        symbol.className =
            "relative z-10 text-6xl md:text-7xl font-black " +
            "text-blue-500 " +
            "drop-shadow-[0_0_20px_rgba(59,130,246,0.9)] " +
            "animate-pulse";

    }


    cell.appendChild(symbol);


    cell.disabled =
        true;


    checkGame();


}





function checkGame() {

    const winningPatterns = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];


    for (
        const pattern of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        if (
            gameState[a] !== ""
            &&
            gameState[a] === gameState[b]
            &&
            gameState[a] === gameState[c]
        ) {

            highlightWinner(
                pattern
            );


            showWinner(
                gameState[a]
            );


            gameOver =
                true;


            return;

        }

    }


    if (
        gameState.every(
            cell => cell !== ""
        )
    ) {

        showDraw();

        gameOver =
            true;

        return;

    }


    switchTurn();

}





function highlightWinner(
    pattern
) {

    pattern.forEach(
        index => {

            const cell =
                board.children[index];


            cell.classList.add(
                "bg-white/[0.08]",
                "scale-105"
            );


            if (
                currentPlayer === "X"
            ) {

                cell.classList.add(
                    "border-purple-500",
                    "shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                );

            } else {

                cell.classList.add(
                    "border-blue-500",
                    "shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                );

            }

        }
    );

}





function switchTurn() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    if (
        currentPlayer === "X"
    ) {

        turnText.textContent =
            "X'S TURN";

        turnText.className =
            "text-xs md:text-sm font-bold tracking-[0.35em] " +
            "text-purple-400 uppercase";


        turnDot.className =
            "w-2.5 h-2.5 rounded-full bg-purple-500 " +
            "shadow-[0_0_15px_rgba(168,85,247,1)] animate-pulse";

    } else {

        turnText.textContent =
            "O'S TURN";

        turnText.className =
            "text-xs md:text-sm font-bold tracking-[0.35em] " +
            "text-blue-400 uppercase";


        turnDot.className =
            "w-2.5 h-2.5 rounded-full bg-blue-500 " +
            "shadow-[0_0_15px_rgba(59,130,246,1)] animate-pulse";

    }

}





function showWinner(
    winner
) {

    const name =
        winner === "X"
            ? localStorage.getItem("player1Name")
            : localStorage.getItem("player2Name");


    winnerTitle.textContent =
        winner;


    winnerName.textContent =
        name || "PLAYER";


    winnerTitle.className =
        winner === "X"

            ?

        "mt-5 text-6xl md:text-8xl font-black tracking-[0.08em] " +
        "text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.9)]"

            :

        "mt-5 text-6xl md:text-8xl font-black tracking-[0.08em] " +
        "text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.9)]";


    winnerOverlay.classList.remove(
        "hidden"
    );

    winnerOverlay.classList.add(
        "flex"
    );

}





function showDraw() {

    winnerTitle.textContent =
        "STALEMATE";


    winnerTitle.className =
        "mt-5 text-5xl md:text-7xl font-black tracking-[0.08em] text-white";


    winnerName.textContent =
        "THE ARENA REMAINS UNCLAIMED";


    winnerOverlay.classList.remove(
        "hidden"
    );

    winnerOverlay.classList.add(
        "flex"
    );

}





function restartGame() {

    gameState = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer =
        "X";


    gameOver =
        false;


    winnerOverlay.classList.add(
        "hidden"
    );

    winnerOverlay.classList.remove(
        "flex"
    );


    createBoard();


    turnText.textContent =
        "X'S TURN";


    turnText.className =
        "text-xs md:text-sm font-bold tracking-[0.35em] " +
        "text-purple-400 uppercase";


    turnDot.className =
        "w-2.5 h-2.5 rounded-full bg-purple-500 " +
        "shadow-[0_0_15px_rgba(168,85,247,1)] animate-pulse";

}





resetGame.addEventListener(
    "click",
    restartGame
);


overlayRematch.addEventListener(
    "click",
    restartGame
);





exitArena.addEventListener(
    "click",
    function () {

        gameBoard.classList.add(
            "hidden"
        );

        gameBoard.classList.remove(
            "flex"
        );


        startScreen.classList.remove(
            "hidden"
        );

        startScreen.classList.remove(
            "opacity-0",
            "scale-105"
        );

    }
);
