const RANDOMIZE_COUNT = 20;
const RANDOMIZE_START_DURATION = 0;
const RANDOMIZE_DURATION_ACCELERATION = 2;

function panic(message) {
	alert(message);
	throw message;
}

const IMAGES = [];
for(let i = 0; i < 57; i++) {
	const imageNumber = i + 1;
	const image = new Image();
	image.src = `images/${imageNumber}.png`;
	IMAGES.push(image);
}

const DECK = IMAGES.length == 57 ?
	createDobbleDeck(8) :
	IMAGES.length == 31 ?
	createDobbleDeck(6) :
	IMAGES.length == 13 ?
	createDobbleDeck(4) :
	panic("numero de cartas tem que ser 57, 31 ou 13. foi " + IMAGES.length);

function createDobbleDeck(n) {
	// n-1 must be prime
	const cards = [];

	// first card and first category
	for (let crd = 0; crd < n; crd++) {
		const symbols = [0];
		for (let sym = 1; sym < n; sym++) {
			symbols.push(crd * (n-1) + sym);
		}
		cards.push(symbols.slice());
	}

	// other categories
	for (let cat = 1; cat < n; cat++) {
		for (let crd = 0; crd < n-1; crd++) {
			const symbols = [cat];
			for (let sym = 1; sym < n; sym++) {
				symbols.push(1 + sym * (n-1) + ((cat-1) * (sym-1) + crd) % (n-1));
			}
			cards.push(symbols.slice());
		}
	}
	return cards;
}

function randomize(canvases) {
	const cardIndexes = {};

	for(const canvas of canvases) {
		const ctx = canvas.getContext("2d");
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let cardIndex = null;
		do {
			cardIndex = Math.floor(Math.random() * DECK.length);
		} while(cardIndexes[cardIndex]);
		cardIndexes[cardIndex] = true;

		const card = DECK[cardIndex];
		const cardRotation = Math.random() * Math.PI;

		const imageWidth = canvas.width * 0.3;
		const imageHeight = canvas.height * 0.3;
		const imageOffsetX = (canvas.width - imageWidth) * 0.5;
		const imageOffsetY = (canvas.height - imageHeight) * 0.5;

		let i = 0;
		for (const imageIndex of card) {
			const image = IMAGES[imageIndex];

			let centerX = canvas.width * 0.5;
			let centerY = canvas.height * 0.5;

			if (i > 0) {
				const angle = ((i - 1) / (card.length - 1)) * 2 * Math.PI + cardRotation;
				centerX += Math.cos(angle) * imageOffsetX;
				centerY += Math.sin(angle) * imageOffsetY;
			}

			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.translate(centerX, centerY);
			ctx.rotate(Math.random() * Math.PI);

			const scale = Math.random() * 0.5 + 0.7;
			ctx.scale(scale, scale);

			ctx.drawImage(image, -imageWidth * 0.5, -imageHeight * 0.5, imageWidth, imageHeight);

			i += 1;
		}
	}
}

function randomizeAnimation(state) {
	if (state.iterationCount >= RANDOMIZE_COUNT) {
		state.timeout = null;
		state.iterationCount = 0;
		state.duration = RANDOMIZE_START_DURATION;
		state.durationVelocity = 0;
		return;
	}

	randomize(state.canvases);
	state.timeout = setTimeout(
		() => { randomizeAnimation(state); },
		state.duration
	);

	state.iterationCount += 1;
	state.duration += state.durationVelocity;
	state.durationVelocity += RANDOMIZE_DURATION_ACCELERATION;
}

window.onload = () => {
	const canvases = document.querySelectorAll("canvas");
	const button = document.querySelector("button.randomize");

	randomize(canvases);

	const animationState = {
		canvases: canvases,
		timeout: null,
		iterationCount: 0,
		duration: RANDOMIZE_START_DURATION,
		durationVelocity: 0,
	};

	button.onclick = () => {
		if (animationState.timeout != null) {
			clearTimeout(animationState.timeout);
			animationState.timeout = null;
		}
		randomizeAnimation(animationState);
	};
};
