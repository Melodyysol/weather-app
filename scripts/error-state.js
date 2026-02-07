
export function errorState() {
  let html = `
    <div class="m-auto text-center">
      <img src="weather-app-main/assets/images/icon-error.svg" alt="Error Icon" class="w-10 m-auto">
      <h2 class="text-[2rem] md:text-[2.5rem] lg:text-[3rem] mt-4">Something went wrong</h2>
      <p class="text-[0.9rem] mt-2 text-[#aeaeb7] leading-4 md:leading-normal lg:leading-relaxed">
        We couldn't connect to the server (API error). Please try<br> again in a few moments.
      </p>
      <button onclick="window.location.reload()" class="js-refresh bg-[#3d3b5e] flex gap-x-2 py-2 px-4 cursor-pointer mt-5 rounded-md m-auto hover:bg-[#3d3b5e9a] focus:outline-2 focus:outline-[#3d3b5e] focus:border-2 focus:border-black">
        <img src="weather-app-main/assets/images/icon-retry.svg" alt="Retry Icon">
        <span>Retry</span>
      </button>
    </div>
  `
  document.querySelector('.js-heading').style.display = 'none';
  document.querySelector('.js-search-cont').style.display = 'none'
  return html;
}