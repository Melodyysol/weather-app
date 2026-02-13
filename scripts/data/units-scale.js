const units = [{
  name: 'temp-scale',
  scale: 'Temperation',
  unit1: 'Celcius (&degC)',
  unit2: 'Fahrenheit (&degF)'
},{
  name: 'wind-scale',
  scale: 'Wind Speed',
  unit1: 'Km/h',
  unit2: 'mph'
},{
  name: 'prec-scale',
  scale: 'Precipitation',
  unit1: 'Millimeters (mm)',
  unit2: 'Inches (In)'
}]

function unitsScale() {
  let html = '';
  units.forEach(unit => {
    html += `
      <div class="border-b border-b-gray-600">
        <p class="text-sm text-[#aeaeb7] pl-2">${unit.scale}</p>
        <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96]">
          <span class="text-[1.2rem]">${unit.unit1}</span>
          <input type="radio" name="${unit.name}" checked class="w-10 bg-transparent border-none ">
        </label>
        <label class="flex justify-between content-center cursor-pointer p-2 rounded-xl hover:bg-[#33314d96] my-2">
          <span class="text-[1.2rem]">${unit.unit2}</span>
          <input type="radio" name="${unit.name}" class="w-10 bg-transparent border-none ">
        </label>
      </div>
    `
  })

  return html;
}

export {unitsScale}