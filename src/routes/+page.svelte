<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import ImageSlider from '../lib/ImageSlider.svelte';
	import LogoSvg from '../lib/LogoSvg.svelte';

	let properties = [];
	let location = 'Amsterdam'; // Default location
	let error = '';
	let jsonResponse = null; // Variable to hold the entire response data
	let nextPageToken = null;
	let currentFrom = null;
	let currentTo = null;
	let checkInDate = new Date(new Date().setDate(new Date().getDate() + 1))
		.toISOString()
		.split('T')[0];
	let checkOutDate = new Date(new Date().setDate(new Date().getDate() + 8))
		.toISOString()
		.split('T')[0];
	let guests = 2;
	let sortBy = '';
	let currency = 'EUR';
	let selectedAmenities = [];
	let showAmenitiesDropdown = false;

	const amenityOptions = [
		{ value: '1', label: 'Free parking' },
		{ value: '3', label: 'Parking' },
		{ value: '4', label: 'Indoor pool' },
		{ value: '5', label: 'Outdoor pool' },
		{ value: '6', label: 'Pool' },
		{ value: '7', label: 'Fitness center' },
		{ value: '8', label: 'Restaurant' },
		{ value: '9', label: 'Free breakfast' },
		{ value: '10', label: 'Spa' },
		{ value: '11', label: 'Beach access' },
		{ value: '12', label: 'Child-friendly' },
		{ value: '15', label: 'Bar' },
		{ value: '19', label: 'Pet-friendly' },
		{ value: '22', label: 'Room service' },
		{ value: '35', label: 'Free Wi-Fi' },
		{ value: '40', label: 'Air-conditioned' },
		{ value: '52', label: 'All-inclusive available' },
		{ value: '53', label: 'Wheelchair accessible' },
		{ value: '61', label: 'EV charger' }
	];

	function toggleAmenity(value) {
		if (selectedAmenities.includes(value)) {
			selectedAmenities = selectedAmenities.filter((a) => a !== value);
		} else {
			selectedAmenities = [...selectedAmenities, value];
		}
	}

	async function loadProperties(pageToken = null) {
		try {
			const params = new URLSearchParams({
				location,
				checkInDate,
				checkOutDate,
				guests,
				sort_by: sortBy,
				currency,
				amenities: selectedAmenities.join(',')
			});
			if (pageToken) {
				params.append('pageToken', pageToken);
			}
			const response = await fetch(`/api/hotels?${params.toString()}`);
			if (response.ok) {
				const data = await response.json();
				console.log('API response data:', data); // Debugging line
				jsonResponse = data; // Store the entire response data
				properties = data.properties || []; // Extract the properties array from the response
				nextPageToken = data.nextPageToken || null;
				currentFrom = data.currentFrom || null;
				currentTo = data.currentTo || null;
			} else {
				const errorResponse = await response.json();
				error = errorResponse.error || 'Failed to load properties';
				console.error('Failed to load properties:', error);
			}
		} catch (err) {
			console.error('Error in loadProperties:', err);
			error = 'An error occurred while loading properties';
		} finally {
			showAmenitiesDropdown = false;
		}
	}

	onMount(() => {
		loadProperties();
	});

	function goToNextPage() {
		if (nextPageToken) {
			loadProperties(nextPageToken).then(() => {
				window.scrollTo(0, 600);
			});
		}
	}

	function toggleDropdown() {
		showAmenitiesDropdown = !showAmenitiesDropdown;
	}
</script>

<div class="background flex flex-col items-center">
	<div class="flex w-full justify-between py-6 px-24">
		<div>
			<LogoSvg />
		</div>
		<div>
			<select bind:value={currency} class="custom-select rounded-lg p-2 w-full">
				<option class="bg-transparent" value="EUR">EUR €</option>
				<option value="USD">USD $</option>
				<option value="GBP">GBP £</option>
			</select>
		</div>
	</div>

	<div class="text-center">
		<h2 class="text-3xl font-medium text-white pt-12">
			Vind Je Perfecte Verblijf <br /> Ontdek De Meest Bijzondere Hotels
		</h2>
	</div>

	<div
		class="bg-white rounded w-3/4 h-96 mt-24 py-8 px-16"
		style="box-shadow: 0 -20px 10px 1px rgba(0, 0, 0, 0.1), 0 -6px 12px -1px rgba(0, 0, 0, 0.06);"
	>
		<div class="w-full">
			<label>Locatie:</label>
			<input
				type="text"
				bind:value={location}
				placeholder="Enter location"
				class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
			/>
		</div>
		<div>
			<div class="flex flex-row mt-6">
				<div class="w-1/3 mr-2">
					<label>Aankomst:</label>
					<input
						type="date"
						bind:value={checkInDate}
						class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					/>
				</div>
				<div class="w-1/3 ml-2">
					<label>Vertrek:</label>
					<input
						type="date"
						bind:value={checkOutDate}
						class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					/>
				</div>
				<div class="w-1/3 ml-2">
					<label>Gasten:</label>
					<input
						type="number"
						bind:value={guests}
						min="1"
						max="6"
						class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
					/>
				</div>
			</div>
		</div>
		<div class="mt-6">
			<label>Sorteer op:</label>
			<select
				bind:value={sortBy}
				class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
			>
				<option value="">Relevantie</option>
				<option value="3">Laagste prijs</option>
				<option value="8">Hoogste beoordeling</option>
				<option value="13">Meest beoordeeld</option>
			</select>
		</div>

		<div class="amenities-dropdown mt-6">
			<button
				type="button"
				on:click={toggleDropdown}
				class="border border-gray-300 rounded-lg p-2 w-full bg-white"
			>
				Filter
			</button>
			{#if showAmenitiesDropdown}
				<div class="dropdown-content p-4 bg-white border border-gray-300 rounded-lg shadow-md mt-2">
					{#each amenityOptions as option}
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id={option.value}
								value={option.value}
								on:change={() => toggleAmenity(option.value)}
								class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
							/>
							<label for={option.value} class="text-sm text-gray-700">{option.label}</label>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<button
			on:click={() => loadProperties()}
			class="bg-blue-500 text-white mt-6 rounded-lg p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
		>
			Zoeken
		</button>

		<div class="space-y-6 py-12 mt-4">
			{#if currentFrom && currentTo}
				<p>Showing results from {currentFrom} to {currentTo}</p>
			{/if}

			{#if properties.length > 0}
				{#each properties as property}
					<div
						class="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full flex flex-col lg:flex-row"
					>
						<div class="mr-8">
							{#if property.images && property.images.length > 0}
								<ImageSlider images={property.images} />
							{/if}
						</div>
						<div class="w-full pr-12 flex flex-col justify-evenly">
							<div>
								<div class="flex flex-row justify-between">
									<div class="">
										<h4 class="text-lg font-semibold mb-2">{property.name}</h4>
										<p class="text-gray-600 mb-2">{property.description}</p>
									</div>
									<div>
										<p class="text-gray-800 text-xl font-bold mb-2">
											{property.rate_per_night.lowest}
										</p>
									</div>
								</div>
								<div class="flex flex-row">
									<p class="text-yellow-500 mb-2">{property.overall_rating}★</p>
									<p class="text-gray-500 mb-2 ml-1">({property.reviews})</p>
								</div>
							</div>

							<div>
								{#if property.link}
									<a href={property.link} target="_blank" class="text-blue-500 hover:underline">
										Go to hotel's website
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<p>No properties found.</p>
			{/if}
		</div>
		{#if nextPageToken}
			<div class="pagination mt-4">
				<button
					on:click={() => goToNextPage()}
					class="bg-blue-500 text-white rounded-lg p-2 mb-24 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
				>
					See more
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.background {
		background-image: url('/images/bg5.jpg');
		background-size: cover;
		background-position-y: 10%;
		height: 70vh;
	}

	.custom-select {
		border: 1px solid white;
		background: transparent;
		color: white;
		border-radius: 0.5rem;
		padding: 0.5rem;
		width: 100%;
	}
	.custom-select option {
		background: transparent; /* Or any other color you prefer */
		color: black;
	}
</style>
