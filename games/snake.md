---
layout: none
title: "snake"
author_profile: false
permalink: /hehehehaw/snake/
sitemap: false
robots: noindex
excerpt: "Hidden subpage under /hehehehaw/"
---

<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Snake</title>
	<link rel="preload" href="/games/assets/snake.css" as="style" />
	<link rel="stylesheet" href="/games/assets/snake.css" />
</head>
<body>
	<div class="snake-wrap">
		<header class="snake-header">
			<div class="snake-card">
				<div class="snake-topbar">
					<h1 class="snake-title">Snake</h1>
					<div class="score">
						<div>
							<div class="label">Score</div>
							<span id="score">0</span>
						</div>
						<div>
							<div class="label">Best</div>
							<span id="best">0</span>
						</div>
					</div>
				</div>

				<div class="snake-stage">
					<canvas id="board" width="600" height="600" aria-label="Snake board" role="img"></canvas>
					<div id="overlay" class="overlay">
						<div class="box">
							<h2 id="overlay-title" style="margin:0 0 8px">Snake</h2>
							<div id="overlay-msg" style="margin-bottom: 12px">Press Start</div>
							<div class="controls">
								<button id="btn-start" class="btn primary">Start</button>
								<button id="btn-restart" class="btn">Restart</button>
								<button id="btn-pause" class="btn">Pause/Resume</button>
								<label class="btn" style="display:flex;align-items:center;gap:6px;">
									Speed
									<select id="speed" style="border:1px solid #e5e7eb;border-radius:8px;padding:4px 6px;">
										<option value="easy">Easy</option>
										<option value="normal" selected>Normal</option>
										<option value="hard">Hard</option>
									</select>
								</label>
							</div>
							<div class="hint">Use arrow keys or WASD. Space to pause/resume.</div>
						</div>
					</div>
				</div>

				<div class="legend">Tip: On mobile, swipe on the board to turn.</div>
			</div>
		</header>
	</div>

	<script defer src="/games/assets/snake.js"></script>
</body>
</html>

