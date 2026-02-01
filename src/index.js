import { challenge } from "./data/challenge.js";

let pageHTML = '';

challenge.forEach(c => {
  let html = ''
  c.frameWork.forEach((f) => html += `<div class="text-xs border border-gray-700 text-gray-400 p-0.5 pl-3 pr-3 rounded-lg">${f}</div>`)

  pageHTML += `
    <div class="js-skills-container rounded-2xl transition-all w-100 h-120 m-auto hover:border-2 border-blue-900">
      <div class="h-2/5 rounded-t-2xl relative cursor-pointer bg-gray-800 hover:bg-gray-900">
        <img src="${c.image}" alt="Challenge Image" class="w-full h-48 m-auto rounded-t-xl">
        <div class="absolute right-2 top-2 text-xs border-none bg-gray-500 p-1 pl-5 pr-5 rounded-full hover:bg-gray-600">${c.level}</div>
      </div>
      <div class="h-3/5 rounded-b-2xl bg-gray-900 p-8 pr-0 flex flex-col gap-y-4">
        <h2 class="text-xl font-bold">${c.type}</h2>
        <div class="flex gap-x-2">
          ${html}
        </div>
        <p class="text-sm text-gray-400">${c.description}</p>
        <div class="flex justify-between mt-10">
          <a href="https://github.com/Melodyysol/${c.name}" class="border border-gray-700 rounded-lg flex justify-between gap-x-3 p-1.5 px-10 hover:bg-gray-800 ">
            <!--<img alt="Github Image">--> Ğ <span>Code</span>
          </a>
          <a href="https://melodyysol.github.io/${c.name}/" class="mr-8 border border-gray-700 rounded-lg flex justify-between gap-x-3 p-1.5 pl-8 pr-8 bg-blue-600 hover:bg-blue-700">
            <!--<img src="" alt="View Image">--> 👀 <span>Go to Page</span>
          </a>
        </div>
      </div>
    </div>
  `
})

document.querySelector('main').innerHTML = pageHTML;