const RANDOMIZE_COUNT = 18;
const RANDOMIZE_START_DURATION = 10;
const RANDOMIZE_DURATION_ACCELERATION = 2;

const images = [];
for(let i = 1; i <= 46; i++) {
	const image = new Image();
	image.src = `img-${i}.png`;
	images.push(image);
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
	const button = document.querySelector("button");

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
