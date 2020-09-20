const RANDOMIZE_COUNT = 20;
const RANDOMIZE_START_DURATION = 0;
const RANDOMIZE_DURATION_ACCELERATION = 2;

function panic(message) {
	alert(message);
	throw message;
}

const images = [];
for(let i = 1; i <= 46; i++) {
	const image = new Image();
	image.src = `img-${i}.png`;
	images.push(image);
}

/*
const deck = images.length == 57 ?
	createDobbleDeck(8) :
	images.length == 31 ?
	createDobbleDeck(6) :
	images.length == 13 ?
	createDobbleDeck(4) :
	panic("numero de cartas tem que ser 57, 27 ou 13");
*/

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

function randomize(imgElements) {
	const indexes = {};

	for(img of imgElements) {
		let index = null;
		do {
			index = Math.floor(Math.random() * images.length);
		} while(indexes[index]);

		indexes[index] = true;
		const image = images[index];
		img.src = image.src;
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

	randomize(state.imgElements);
	state.timeout = setTimeout(
		() => { randomizeAnimation(state); },
		state.duration
	);

	state.iterationCount += 1;
	state.duration += state.durationVelocity;
	state.durationVelocity += RANDOMIZE_DURATION_ACCELERATION;
}

window.onload = () => {
	const imgs = document.querySelectorAll(".image-container img");
	const button = document.querySelector("button#randomize");

	randomize(imgs);

	const animationState = {
		imgElements: imgs,
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
