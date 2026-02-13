import { unitsScale } from "../data/units-scale.js";

export function pageHead() { 
  const pageHeadHTML = `
    <div class="flex flex-wrap justify-between content-center">
      <img class="w-31" src="weather-app-main/assets/images/logo.svg" alt="Weather Logo">
      <div class="js-units-display relative cursor-pointer bg-[#3d3b5e] flex justify-center gap-x-2 w-25 content-center py-2 rounded-md">
        <img src="weather-app-main/assets/images/icon-units.svg" alt="Setting Icon">
        <span class="text-[0.75rem]">Units</span>
        <img  src="weather-app-main/assets/images/icon-dropdown.svg" alt="Dropdown Icon">
        <div class="js-units-conversion absolute flex-col gap-y-5 bg-[#3d3b5e] w-60 mt-2 rounded-xl px-2 pt-4 pb-10 z-10 right-0 top-full overflow-auto border border-gray-600 hidden">
          <h1 class="text-[1.2rem] pl-2">Switch to Imperial</h1>
          ${unitsScale()}
        </div>
      </div>
    </div>
    <h1 class="js-heading heading font-['Bricolage_Grotesque'] font-bold text-[2.8rem] text-center mt-15"><span>How's the </span><span class="block md:inline">sky looking</span> today?</h1>
    <div class="js-search-cont mt-10 flex flex-col gap-y-3 md:flex-row md:gap-x-4 md:m-auto md:w-3/4 lg:w-1/2 md:mt-12">
      <div class="z-100 relative bg-[#3d3b5e] flex rounded-xl p-3 gap-x-4 content-center hover:opacity-90 md:flex-1">
        <img class="ml-3" src="weather-app-main/assets/images/icon-search.svg" alt="Search Icon">
        <input class="js-search-input bg-transparent flex-1 text-[1.2rem] caret-white outline-none border-none placeholder:text-[#aeaeb7]" type="text" placeholder="Search for a place...">
        <div class="js-search-suggestion absolute bg-[#3d3b5e] w-full mt-1 rounded-md p-2 z-10 left-0 top-full max-h-60 overflow-y-auto border border-gray-600 hidden">
        </div>
      </div>
      <button class="js-search-button bg-[#4455da] text-[1.2rem] py-3 cursor-pointer rounded-xl w-full border-0 hover:opacity-90 focus:outline-2 focus:outline-[#4455da] focus:border-2 focus:border-black md:w-1/6">Search</button>
    </div>
  `
  return pageHeadHTML;
}