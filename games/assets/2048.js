document.addEventListener('DOMContentLoaded', () => {
    const GRID_SIZE = 4;

    // Game state
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;
    let gameWon = false;
    let isAnimating = false; // lock input during animations
    let queuedDir = null; // coalesce next direction while animating

    // DOM elements
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const gameMessage = document.getElementById('game-message');
    const restartButton = document.getElementById('restart-button');

    function initGame() {
        createGrid();
    spawn(true);
    spawn(true);
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

    function spawn(animate = false) {
        if (isFull()) return false;
        const empty = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === 0) empty.push([r, c]);
            }
        }
        const [r, c] = empty[(Math.random() * empty.length) | 0];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        createOrUpdateTile(`${r}_${c}`, r, c, grid[r][c], animate ? 'tile-new' : '');
        return true;
    }

    function createOrUpdateTile(id, r, c, value, extraClass = '') {
        let tile = gridContainer.querySelector(`.tile[data-id="${id}"]`);
        const { gap, size } = getCellMetrics();
        const top = r * (size + gap);
        const left = c * (size + gap);

        if (!tile) {
            tile = document.createElement('div');
            tile.className = `tile tile-${value}`;
            if (extraClass) tile.classList.add(extraClass);
            tile.textContent = value;
            tile.dataset.id = id;
            tile.dataset.row = String(r);
            tile.dataset.col = String(c);
            tile.style.width = `${size}px`;
            tile.style.height = `${size}px`;
            tile.style.top = `${top}px`;
            tile.style.left = `${left}px`;
            const digits = String(value).length;
            let scale = 0.5;
            if (digits === 3) scale = 0.42; else if (digits >= 4) scale = 0.36;
            tile.style.fontSize = `${Math.max(14, Math.floor(size * scale))}px`;
            gridContainer.appendChild(tile);
        } else {
            tile.className = `tile tile-${value}`;
            if (extraClass) tile.classList.add(extraClass);
            tile.textContent = value;
            tile.dataset.row = String(r);
            tile.dataset.col = String(c);
            tile.style.width = `${size}px`;
            tile.style.height = `${size}px`;
            const digits = String(value).length;
            let scale = 0.5;
            if (digits === 3) scale = 0.42; else if (digits >= 4) scale = 0.36;
            tile.style.fontSize = `${Math.max(14, Math.floor(size * scale))}px`;
            tile.style.top = `${top}px`;
            tile.style.left = `${left}px`;
        }
        return tile;
    }

    function rebuildTilesInstant() {
        gridContainer.querySelectorAll('.tile').forEach(t => t.remove());
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const v = grid[r][c];
                if (v !== 0) createOrUpdateTile(`${r}_${c}`, r, c, v);
            }
        }
    }

    function relayoutExistingTiles() {
        const tiles = gridContainer.querySelectorAll('.tile');
        const { gap, size } = getCellMetrics();
        tiles.forEach(tile => {
            const r = parseInt(tile.dataset.row, 10);
            const c = parseInt(tile.dataset.col, 10);
            const v = parseInt(tile.textContent || '0', 10);
            tile.style.width = `${size}px`;
            tile.style.height = `${size}px`;
            tile.style.top = `${r * (size + gap)}px`;
            tile.style.left = `${c * (size + gap)}px`;
            const digits = String(v).length;
            let scale = 0.5;
            if (digits === 3) scale = 0.42; else if (digits >= 4) scale = 0.36;
            tile.style.fontSize = `${Math.max(14, Math.floor(size * scale))}px`;
        });
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

    // Animated move logic similar to original 2048
    function move(dir) {
        if (gameOver || isAnimating) return;

        const before = JSON.stringify(grid);
        const size = GRID_SIZE;

        // Prepare tiles for current state if not present
        rebuildTilesInstant();

        const vector = dir === 'left' ? [0, -1]
            : dir === 'right' ? [0, 1]
            : dir === 'up' ? [-1, 0]
            : [1, 0];

        const cells = [];
        if (dir === 'left') {
            for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) cells.push([r, c]);
        } else if (dir === 'right') {
            for (let r = 0; r < size; r++) for (let c = size - 1; c >= 0; c--) cells.push([r, c]);
        } else if (dir === 'up') {
            for (let c = 0; c < size; c++) for (let r = 0; r < size; r++) cells.push([r, c]);
        } else if (dir === 'down') {
            for (let c = 0; c < size; c++) for (let r = size - 1; r >= 0; r--) cells.push([r, c]);
        }

        const mergedMap = Array.from({ length: size }, () => Array(size).fill(false));
        const movesToAnimate = [];
        let moved = false;

        for (const [r0, c0] of cells) {
            let r = r0, c = c0;
            const val = grid[r][c];
            if (val === 0) continue;

            let nr = r + vector[0];
            let nc = c + vector[1];
            while (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 0) {
                r = nr; c = nc;
                nr += vector[0];
                nc += vector[1];
            }

            if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === val && !mergedMap[nr][nc]) {
                // merge
                movesToAnimate.push({ fromR: r0, fromC: c0, toR: nr, toC: nc, fromVal: val, merge: true });
                grid[r0][c0] = 0;
                grid[nr][nc] = val * 2;
                mergedMap[nr][nc] = true;
                score += val * 2;
                if (r0 !== nr || c0 !== nc) moved = true;
            } else {
                movesToAnimate.push({ fromR: r0, fromC: c0, toR: r, toC: c, fromVal: val, merge: false });
                if (r0 !== r || c0 !== c) {
                    grid[r0][c0] = 0;
                    grid[r][c] = val;
                    moved = true;
                }
            }
        }

        const after = JSON.stringify(grid);
        if (!moved || before === after) {
            // No move: wiggle the grid for feedback
            gridContainer.classList.add('no-move');
            setTimeout(() => gridContainer.classList.remove('no-move'), 200);
            return;
        }

        isAnimating = true;
        updateScore();

        const animations = [];
        const { gap, size: cellSize } = getCellMetrics();
        for (const mv of movesToAnimate) {
            // Skip stationary tiles (no animation needed)
            if (!mv.merge && mv.fromR === mv.toR && mv.fromC === mv.toC) continue;
            const id = `${mv.fromR}_${mv.fromC}`;
            const tile = createOrUpdateTile(id, mv.fromR, mv.fromC, mv.fromVal);
            const toTop = mv.toR * (cellSize + gap);
            const toLeft = mv.toC * (cellSize + gap);

            animations.push(new Promise(resolve => {
                const onEnd = (e) => {
                    if (e && e.propertyName && e.propertyName !== 'top' && e.propertyName !== 'left') return;
                    tile.removeEventListener('transitionend', onEnd);
                    tile.classList.remove('tile-moving');
                    resolve();
                };
                tile.addEventListener('transitionend', onEnd);
                requestAnimationFrame(() => {
                    tile.classList.add('tile-moving');
                    tile.style.top = `${toTop}px`;
                    tile.style.left = `${toLeft}px`;
                    tile.dataset.row = String(mv.toR);
                    tile.dataset.col = String(mv.toC);
                });
            }));
        }

        Promise.all(animations).then(() => {
            // Rebuild tiles reflecting new values; apply merge pop
            gridContainer.querySelectorAll('.tile').forEach(t => t.remove());
            const mergedCells = new Set(movesToAnimate.filter(m => m.merge).map(m => `${m.toR}_${m.toC}`));
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    const v = grid[r][c];
                    if (v !== 0) {
                        const key = `${r}_${c}`;
                        const extra = mergedCells.has(key) ? 'tile-merged' : '';
                        createOrUpdateTile(key, r, c, v, extra);
                    }
                }
            }

            // Spawn a new tile
            setTimeout(() => {
                spawn(true);
                if (won() && !gameWon) {
                    gameWon = true;
                    showMessage('You Win!', true);
                }
                if (!hasMoves()) {
                    gameOver = true;
                    showMessage('Game Over!');
                }
                isAnimating = false;
                // If a direction was queued during animation, perform it now
                if (queuedDir && !gameOver) {
                    const next = queuedDir;
                    queuedDir = null;
                    // Defer to allow DOM to settle
                    setTimeout(() => move(next), 0);
                }
            }, 20);
        });
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

        let dir = null;
        if (k === 'arrowup' || code === 'KeyW' || k === 'w') dir = 'up';
        else if (k === 'arrowright' || code === 'KeyD' || k === 'd') dir = 'right';
        else if (k === 'arrowdown' || code === 'KeyS' || k === 's') dir = 'down';
        else if (k === 'arrowleft' || code === 'KeyA' || k === 'a') dir = 'left';

        if (!dir) return;

        if (isAnimating) {
            // Coalesce to latest requested direction
            queuedDir = dir;
            e.preventDefault();
            return;
        }

        move(dir);
        e.preventDefault();
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
    spawn(true);
    spawn(true);
        updateScore();
    }

    document.addEventListener('keydown', handleKeyDown);
    restartButton.addEventListener('click', restartGame);
    gameMessage.querySelector('.restart-button').addEventListener('click', restartGame);

    window.addEventListener('resize', relayoutExistingTiles);

    initGame();
});
