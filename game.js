(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const gameOverOverlay = document.getElementById("game-over");
  const restartButton = document.getElementById("restart");
  const watchAdButton = document.getElementById("watch-ad");

  const state = {
    blocks: [],
    current: null,
    speed: 1.6,
    direction: 1,
    score: 0,
    isRunning: true,
    cameraOffset: 0,
    lastTime: 0,
  };

  const config = {
    baseWidth: 180,
    blockHeight: 32,
    maxSpeed: 6,
    speedStep: 0.12,
    perfectThreshold: 6,
  };

  function resizeCanvas() {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth * window.devicePixelRatio;
    canvas.height = (innerHeight - document.getElementById("banner-ad").offsetHeight) * window.devicePixelRatio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight - document.getElementById("banner-ad").offsetHeight}px`;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function resetGame() {
    state.blocks = [];
    state.score = 0;
    state.speed = 1.6;
    state.direction = 1;
    state.cameraOffset = 0;
    state.isRunning = true;
    scoreEl.textContent = "0";
    gameOverOverlay.classList.add("hidden");
    gameOverOverlay.setAttribute("aria-hidden", "true");

    const baseBlock = createBlock({
      x: canvas.width / 2 / window.devicePixelRatio,
      y: canvas.height / window.devicePixelRatio - config.blockHeight,
      width: config.baseWidth,
      color: "#5c8cff",
      isBase: true,
    });

    state.blocks.push(baseBlock);
    state.current = spawnBlock();
  }

  function createBlock({ x, y, width, color, isBase = false }) {
    return {
      x,
      y,
      width,
      height: config.blockHeight,
      color,
      isBase,
    };
  }

  function spawnBlock() {
    const lastBlock = state.blocks[state.blocks.length - 1];
    const startOffset = (canvas.width / window.devicePixelRatio - lastBlock.width) / 2;
    const colorHue = 210 + (state.blocks.length * 12) % 120;

    return createBlock({
      x: startOffset,
      y: lastBlock.y - config.blockHeight,
      width: lastBlock.width,
      color: `hsl(${colorHue}, 72%, 60%)`,
    });
  }

  function update(delta) {
    if (!state.isRunning || !state.current) {
      return;
    }

    const maxX = canvas.width / window.devicePixelRatio - state.current.width;
    state.current.x += state.speed * state.direction * delta;

    if (state.current.x <= 0) {
      state.current.x = 0;
      state.direction = 1;
    } else if (state.current.x >= maxX) {
      state.current.x = maxX;
      state.direction = -1;
    }
  }

  function calculateOverlap() {
    const lastBlock = state.blocks[state.blocks.length - 1];
    const left = Math.max(state.current.x, lastBlock.x);
    const right = Math.min(state.current.x + state.current.width, lastBlock.x + lastBlock.width);
    const overlap = right - left;
    return { overlap, left };
  }

  function handleDrop() {
    if (!state.isRunning || !state.current) {
      return;
    }

    const { overlap, left } = calculateOverlap();
    const lastBlock = state.blocks[state.blocks.length - 1];

    if (overlap <= 0) {
      triggerGameOver();
      return;
    }

    const alignmentDiff = Math.abs(state.current.x - lastBlock.x);
    let nextWidth = overlap;
    let nextX = left;

    if (alignmentDiff < config.perfectThreshold) {
      nextWidth = lastBlock.width;
      nextX = lastBlock.x;
    }

    const landedBlock = createBlock({
      x: nextX,
      y: state.current.y,
      width: nextWidth,
      color: state.current.color,
    });

    state.blocks.push(landedBlock);
    state.score += 1;
    scoreEl.textContent = state.score.toString();
    state.speed = Math.min(config.maxSpeed, state.speed + config.speedStep);

    state.current = spawnBlock();
    adjustCamera();
  }

  function adjustCamera() {
    const targetY = canvas.height / window.devicePixelRatio - (state.blocks.length * config.blockHeight + 120);
    state.cameraOffset = Math.max(0, -targetY);
  }

  function triggerGameOver() {
    state.isRunning = false;
    gameOverOverlay.classList.remove("hidden");
    gameOverOverlay.setAttribute("aria-hidden", "false");
  }

  function continueAfterAd() {
    state.isRunning = true;
    gameOverOverlay.classList.add("hidden");
    gameOverOverlay.setAttribute("aria-hidden", "true");
    state.current = spawnBlock();
  }

  function drawBackground() {
    ctx.fillStyle = "#0b1020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - i * 120 - state.cameraOffset * window.devicePixelRatio);
      ctx.lineTo(canvas.width, canvas.height - i * 120 - state.cameraOffset * window.devicePixelRatio);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBlocks() {
    ctx.save();
    ctx.translate(0, -state.cameraOffset * window.devicePixelRatio);

    state.blocks.forEach((block) => {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.width, block.height);
    });

    if (state.current) {
      ctx.fillStyle = state.current.color;
      ctx.fillRect(state.current.x, state.current.y, state.current.width, state.current.height);
    }

    ctx.restore();
  }

  function render(timestamp) {
    const delta = (timestamp - state.lastTime) / 16.67;
    state.lastTime = timestamp;

    update(delta);
    drawBackground();
    drawBlocks();

    requestAnimationFrame(render);
  }

  function bindEvents() {
    const onAction = (event) => {
      event.preventDefault();
      handleDrop();
    };

    window.addEventListener("resize", () => {
      resizeCanvas();
      resetGame();
    });

    canvas.addEventListener("pointerdown", onAction);
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        handleDrop();
      }
    });

    restartButton.addEventListener("click", resetGame);
    watchAdButton.addEventListener("click", () => {
      window.Ads.showRewardedAd({
        onComplete: continueAfterAd,
      });
    });
  }

  function init() {
    resizeCanvas();
    resetGame();
    bindEvents();
    window.Ads.showBannerAd();
    requestAnimationFrame(render);
  }

  init();
})();
