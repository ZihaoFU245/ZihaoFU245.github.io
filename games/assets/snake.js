/* Snake game (light theme) */
(function () {
	const CELL = 20; // px per grid cell (canvas internal size)
	const COLS = 30; // grid width
	const ROWS = 30; // grid height
	const SPEEDS = { easy: 8, normal: 12, hard: 16 }; // ticks per second

	const canvas = document.getElementById('board');
	const overlay = document.getElementById('overlay');
	const overlayTitle = document.getElementById('overlay-title');
	const overlayMsg = document.getElementById('overlay-msg');
	const btnStart = document.getElementById('btn-start');
	const btnPause = document.getElementById('btn-pause');
	const btnRestart = document.getElementById('btn-restart');
	const speedSelect = document.getElementById('speed');
	const scoreEl = document.getElementById('score');
	const bestEl = document.getElementById('best');

	if (!canvas) return; // allow page to load without errors if missing
	const ctx = canvas.getContext('2d');
	canvas.width = COLS * CELL;
	canvas.height = ROWS * CELL;

	// Colors match CSS variables
	const colors = {
		grid: '#eeeeee',
		food: '#ef4444',
		snake: '#16a34a',
		head: '#15803d',
		bg: '#fafafa'
	};

	// Game state
		let snake, dir, nextDir, food, score, best, speed, running, rafId, ended;
	let lastTime = 0;
	let acc = 0;

	function reset() {
		snake = [
			{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
			{ x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
		];
		dir = { x: 1, y: 0 };
		nextDir = { x: 1, y: 0 };
		food = spawnFood();
		score = 0;
		speed = SPEEDS[speedSelect?.value] || SPEEDS.normal;
		scoreEl && (scoreEl.textContent = String(score));
		best = Number(localStorage.getItem('snake-best') || '0');
		bestEl && (bestEl.textContent = String(best));
		running = false;
		ended = false;
		showOverlay('Snake', 'Press Start or Space');
		drawBoard();
		drawSnake();
		drawFood();
	}

	function spawnFood() {
		while (true) {
			const x = Math.floor(Math.random() * COLS);
			const y = Math.floor(Math.random() * ROWS);
			if (!snake || !snake.some(s => s.x === x && s.y === y)) {
				return { x, y };
			}
		}
	}

	function showOverlay(title, msg, showButtons = true) {
		if (!overlay) return;
		overlayTitle && (overlayTitle.textContent = title);
		overlayMsg && (overlayMsg.textContent = msg);
		overlay.classList.remove('hidden');
		if (btnStart) btnStart.style.display = showButtons ? 'inline-block' : 'none';
	}

	function hideOverlay() {
		overlay && overlay.classList.add('hidden');
	}

	function setSpeedFromSelect() {
		speed = SPEEDS[speedSelect?.value] || SPEEDS.normal;
	}

	function update(dt) {
		acc += dt;
		const interval = 1000 / speed;
		while (acc >= interval) {
			acc -= interval;
			step();
		}
	}

	function step() {
		// update direction at most once per tick
		if ((nextDir.x !== -dir.x) || (nextDir.y !== -dir.y)) {
			dir = nextDir;
		}
		const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

		// collisions: walls
		if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
			return gameOver();
		}
		// collisions: self
		if (snake.some(s => s.x === head.x && s.y === head.y)) {
			return gameOver();
		}

		snake.unshift(head);
		if (head.x === food.x && head.y === food.y) {
			score += 10;
			scoreEl && (scoreEl.textContent = String(score));
			if (score > best) {
				best = score; localStorage.setItem('snake-best', String(best));
				bestEl && (bestEl.textContent = String(best));
			}
			food = spawnFood();
		} else {
			snake.pop();
		}
	}

	function gameOver() {
		running = false;
		ended = true;
		cancelAnimationFrame(rafId);
		// Clear current state visuals
		snake = [];
		food = null;
		drawBoard();
		showOverlay('Game Over', `Score: ${score}`);
	}

	function drawBoard() {
		// background
		ctx.fillStyle = colors.bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		// grid
		ctx.strokeStyle = colors.grid;
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let x = 0.5; x < canvas.width; x += CELL) {
			ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
		}
		for (let y = 0.5; y < canvas.height; y += CELL) {
			ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
		}
		ctx.stroke();
	}

	function drawSnake() {
		// body
		ctx.fillStyle = colors.snake;
		for (let i = snake.length - 1; i >= 1; i--) {
			const s = snake[i];
			drawCell(s.x, s.y, ctx.fillStyle, 4);
		}
		// head
		const h = snake[0];
		drawCell(h.x, h.y, colors.head, 4);
	}

	function drawFood() {
		drawCell(food.x, food.y, colors.food, 6);
	}

	function drawCell(x, y, color, pad = 0) {
		const px = x * CELL + pad;
		const py = y * CELL + pad;
		const size = CELL - pad * 2;
		const r = Math.min(6, size / 2);
		roundRect(ctx, px, py, size, size, r, color);
	}

	function roundRect(ctx, x, y, w, h, r, fill) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + w, y, x + w, y + h, r);
		ctx.arcTo(x + w, y + h, x, y + h, r);
		ctx.arcTo(x, y + h, x, y, r);
		ctx.arcTo(x, y, x + w, y, r);
		ctx.closePath();
		ctx.fillStyle = fill;
		ctx.fill();
	}

	function render(t) {
		if (!running) return;
		const dt = t - lastTime; lastTime = t;
		update(dt);
		drawBoard();
		drawFood();
		drawSnake();
		rafId = requestAnimationFrame(render);
	}

	function start() {
		if (running) return;
			// If previous state ended or invalid, reset before starting
			if (!Array.isArray(snake) || snake.length < 1 || ended) {
				reset();
			}
		hideOverlay();
		running = true;
		lastTime = performance.now();
		acc = 0;
		rafId = requestAnimationFrame(render);
	}

	function pause() {
		if (!running) return;
		running = false;
		cancelAnimationFrame(rafId);
		showOverlay('Paused', 'Press Resume or Space');
	}

	function restart() {
		reset();
		start();
	}

	// Input handling
	const KEY_DIR = {
		ArrowUp: { x: 0, y: -1 },
		ArrowDown: { x: 0, y: 1 },
		ArrowLeft: { x: -1, y: 0 },
		ArrowRight: { x: 1, y: 0 },
		w: { x: 0, y: -1 },
		s: { x: 0, y: 1 },
		a: { x: -1, y: 0 },
		d: { x: 1, y: 0 },
	};

	window.addEventListener('keydown', (e) => {
		const k = e.key;
		if (k === ' ' || k === 'Spacebar') {
			e.preventDefault();
			if (!running && overlay && !overlay.classList.contains('hidden')) start();
			else if (running) pause();
			else start();
			return;
		}
		const nd = KEY_DIR[k];
		if (nd) {
			e.preventDefault();
			// prevent 180° within a single tick
			if (!(nd.x === -dir.x && nd.y === -dir.y)) {
				nextDir = nd;
			}
		}
	});

	// Simple swipe for mobile
	let touchStart = null;
	canvas.addEventListener('touchstart', (e) => {
		if (e.touches.length) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	}, { passive: true });
	canvas.addEventListener('touchend', (e) => {
		if (!touchStart) return;
		const t = e.changedTouches[0];
		const dx = t.clientX - touchStart.x;
		const dy = t.clientY - touchStart.y;
		if (Math.abs(dx) > Math.abs(dy)) {
			nextDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
		} else {
			nextDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
		}
		touchStart = null;
	});

	btnStart && btnStart.addEventListener('click', () => start());
	btnPause && btnPause.addEventListener('click', () => (running ? pause() : start()));
	btnRestart && btnRestart.addEventListener('click', () => restart());
	speedSelect && speedSelect.addEventListener('change', () => setSpeedFromSelect());

	// Initialize
	reset();
})();
