function unitsScale() {
  return `
    <div class="border-b border-b-gray-600 z-20">
      <p class="text-sm text-[#aeaeb7] pl-2">Temperation</p>
      <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96]">
        <span class="text-[1.2rem]">Celcius (&degC)</span>
        <input type="checkbox" name="temp-scale" checked class="w-10 bg-transparent border-none appearance-none checked:before:content-['✓'] checked:before:text-white">
      </label>
      <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96] my-2">
        <span class="text-[1.2rem]">Fahrenheit (&degF)</span>
        <input type="checkbox" name="temp-scale" class="w-10 bg-transparent border-none appearance-none checked:before:content-['✓'] checked:before:text-white">
      </label>
    </div>
    <div class="border-b border-b-gray-600 z-20">
      <p class="text-sm text-[#aeaeb7] pl-2">Wind Speed</p>
      <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96]">
        <span class="text-[1.2rem]">Km/h</span>
        <input type="checkbox" name="wind-scale" checked class="w-10 bg-transparent border-none appearance-none checked:before:content-['✓'] checked:before:text-white">
      </label>
      <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96] my-2">
        <span class="text-[1.2rem]">mph</span>
        <input type="checkbox" name="wind-scale" class="w-10 bg-transparent border-none appearance-none checked:before:content-['✓'] checked:before:text-white">
      </label>
    </div>
    <div class="border-b border-b-gray-600 z-20">
      <p class="text-sm text-[#aeaeb7] pl-2">Precipitation</p>
      <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96]">
        <span class="text-[1.2rem]">Millimeters (mm)</span>
        <input type="checkbox" name="prec-scale" checked class="w-10 bg-transparent border-none appearance-none checked:before:content-['✓'] checked:before:text-white">
      </label>
      <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96] my-2">
        <span class="text-[1.2rem]">Inches (In)</span>
        <input type="checkbox" name="prec-scale" class="w-10 bg-transparent border-none appearance-none checked:before:content-['✓'] checked:before:text-white">
      </label>
    </div>
    <button id="switch-imperial" class="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">Switch to Imperial</button>
  `;
}

export {unitsScale}