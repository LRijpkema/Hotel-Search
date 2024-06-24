<script>
	export let value = 0; // Progress value (0-100)
</script>

<div class="progress-bar">
	<div class="progress" style="width: {value}%;"></div>
</div>

<style>
	.progress-bar {
		width: 100%;
		background-color: #f3f3f3;
		border-radius: 4px;
		overflow: hidden;
	}
	.progress {
		height: 20px;
		background-color: #4caf50;
		width: 0%;
		transition: width 0.3s ease;
	}
</style>
