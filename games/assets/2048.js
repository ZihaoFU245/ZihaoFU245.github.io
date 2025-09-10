document.addEventListener('DOMContentLoaded', () => {
    const GRID_SIZE = 4;

    // Game state
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;
    let gameWon = false;

    // DOM elements
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const gameMessage = document.getElementById('game-message');
    const restartButton = document.getElementById('restart-button');

    function initGame() {
        createGrid();
        spawn();
        spawn();
        updateScore();
        bestScoreDisplay.textContent = bestScore;
    }

    function createGrid() {
        gridContainer.innerHTML = '';
        grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                gridContainer.appendChild(cell);
            }
        }
    }

    function getCellMetrics() {
        const styles = getComputedStyle(gridContainer);
        const gapRaw = styles.gap || styles.gridGap || styles.gridColumnGap || styles.gridRowGap || '15px';
        const gap = parseFloat(gapRaw);
        const size = (gridContainer.clientWidth - gap * (GRID_SIZE - 1)) / GRID_SIZE;
        return { gap, size };
    }

    function spawn() {
        if (isFull()) return false;
        const empty = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === 0) empty.push([r, c]);
            }
        }
        const [r, c] = empty[(Math.random() * empty.length) | 0];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        updateGrid();
        return true;
    }

    function addTile(r, c, value) {
        const tile = document.createElement('div');
        tile.classList.add('tile', `tile-${value}`);
        tile.textContent = value;

        const { gap, size } = getCellMetrics();
        tile.style.width = `${size}px`;
        tile.style.height = `${size}px`;
        tile.style.top = `${r * (size + gap)}px`;
        tile.style.left = `${c * (size + gap)}px`;

        // Fit text size
        const digits = String(value).length;
        let scale = 0.5;
        if (digits === 3) scale = 0.42; else if (digits >= 4) scale = 0.36;
        tile.style.fontSize = `${Math.max(14, Math.floor(size * scale))}px`;

        gridContainer.appendChild(tile);
    }

    function updateGrid() {
        const tiles = gridContainer.querySelectorAll('.tile');
        tiles.forEach(t => t.remove());
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] !== 0) addTile(r, c, grid[r][c]);
            }
        }
    }

    function updateScore() {
        scoreDisplay.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }

    function isFull() {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === 0) return false;
            }
        }
        return true;
    }

    function hasMoves() {
        if (!isFull()) return true;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 1; c++) {
                if (grid[r][c] === grid[r][c + 1]) return true;
            }
        }
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 1; r++) {
                if (grid[r][c] === grid[r + 1][c]) return true;
            }
        }
        return false;
    }

    function won() {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === 2048) return true;
            }
        }
        return false;
    }

    // Core move logic with correct merging for all directions
    function move(dir) {
        if (gameOver) return;

        const before = JSON.stringify(grid);

        let lines = [];
        // Extract lines depending on direction
        if (dir === 'left') {
            lines = grid.map(row => row.slice());
        } else if (dir === 'right') {
            lines = grid.map(row => row.slice().reverse());
        } else if (dir === 'up') {
            for (let c = 0; c < GRID_SIZE; c++) {
                const col = [];
                for (let r = 0; r < GRID_SIZE; r++) col.push(grid[r][c]);
                lines.push(col);
            }
        } else if (dir === 'down') {
            for (let c = 0; c < GRID_SIZE; c++) {
                const col = [];
                for (let r = GRID_SIZE - 1; r >= 0; r--) col.push(grid[r][c]);
                lines.push(col);
            }
        }

        // Process each line: compress, merge once, compress
        const processed = lines.map(line => {
            const filtered = line.filter(v => v !== 0);
            const merged = [];
            for (let i = 0; i < filtered.length; i++) {
                if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
                    const val = filtered[i] * 2;
                    merged.push(val);
                    score += val;
                    i++; // skip next
                } else {
                    merged.push(filtered[i]);
                }
            }
            while (merged.length < GRID_SIZE) merged.push(0);
            return merged;
        });

        // Write back processed lines into grid based on direction
        if (dir === 'left') {
            for (let r = 0; r < GRID_SIZE; r++) grid[r] = processed[r];
        } else if (dir === 'right') {
            for (let r = 0; r < GRID_SIZE; r++) grid[r] = processed[r].slice().reverse();
        } else if (dir === 'up') {
            for (let c = 0; c < GRID_SIZE; c++) {
                for (let r = 0; r < GRID_SIZE; r++) grid[r][c] = processed[c][r];
            }
        } else if (dir === 'down') {
            for (let c = 0; c < GRID_SIZE; c++) {
                for (let r = 0; r < GRID_SIZE; r++) grid[GRID_SIZE - 1 - r][c] = processed[c][r];
            }
        }

        const after = JSON.stringify(grid);
        if (before !== after) {
            updateGrid();
            updateScore();
            setTimeout(() => {
                spawn();
                if (won() && !gameWon) {
                    gameWon = true;
                    showMessage('You Win!', true);
                }
                if (!hasMoves()) {
                    gameOver = true;
                    showMessage('Game Over!');
                }
            }, 120);
        }
    }

    function showMessage(msg, isWin = false) {
        gameMessage.querySelector('p').textContent = msg;
        gameMessage.style.display = 'flex';
        if (isWin) gameMessage.classList.add('game-won'); else gameMessage.classList.remove('game-won');
    }

    function handleKeyDown(e) {
        if (gameOver && !gameWon) return;
        const k = (e.key || '').toLowerCase();
        const code = e.code || '';

        let handled = false;
        if (k === 'arrowup' || code === 'KeyW' || k === 'w') { move('up'); handled = true; }
        else if (k === 'arrowright' || code === 'KeyD' || k === 'd') { move('right'); handled = true; }
        else if (k === 'arrowdown' || code === 'KeyS' || k === 's') { move('down'); handled = true; }
        else if (k === 'arrowleft' || code === 'KeyA' || k === 'a') { move('left'); handled = true; }

        if (handled) e.preventDefault();
    }

    function restartGame() {
        grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        score = 0;
        gameOver = false;
        gameWon = false;
        gameMessage.style.display = 'none';
        gridContainer.innerHTML = '';
        // rebuild background grid
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                gridContainer.appendChild(cell);
            }
        }
        spawn();
        spawn();
        updateScore();
    }

    document.addEventListener('keydown', handleKeyDown);
    restartButton.addEventListener('click', restartGame);
    gameMessage.querySelector('.restart-button').addEventListener('click', restartGame);

    window.addEventListener('resize', updateGrid);

    initGame();
});
