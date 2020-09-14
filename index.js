const images = [];
for(const i = 1; i <= 46; i++) {
	const image = new Image();
	image.src = `Dobble (${i}).png`;
	images.push(image);
}

window.onload = () => {
	const imgs = document.querySelectorAll("img");
	const button = document.querySelector("button");
	button.onclick = () => {
	};
};
