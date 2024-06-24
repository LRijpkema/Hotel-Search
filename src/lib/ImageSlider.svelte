<script>
	export let images = [];
	let currentIndex = 0;

	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prevImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}
</script>

<div class="slider-container">
	{#if images.length > 0}
		<div class="slider">
			<button on:click={prevImage} class="prev-button">❮</button>
			<img src={images[currentIndex].thumbnail} alt="Property image" class="slider-image rounded" />
			<button on:click={nextImage} class="next-button">❯</button>
		</div>
	{/if}
</div>

<style>
	.slider-container {
		position: relative;
		width: 100%;
		max-width: 600px;
		margin: auto;
		overflow: hidden;
	}
	.slider {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.slider-image {
		width: 100%;
		height: auto;
	}
	.prev-button,
	.next-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		padding: 10px;
		cursor: pointer;
	}
	.prev-button {
		left: 10px;
	}
	.next-button {
		right: 10px;
	}
</style>
