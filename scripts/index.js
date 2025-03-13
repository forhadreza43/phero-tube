function removeActiveClass() {
  document
    .querySelectorAll("button.active")
    .forEach((btn) => btn.classList.remove("active"));
}

async function loadCategory() {
  const loadCategories = await fetch(
    "https://openapi.programming-hero.com/api/phero-tube/categories",
  );
  const categories = await loadCategories.json();
  display(categories.categories);
}

function loadVideos(kwrd = "") {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${kwrd}`,
  )
    .then((res) => res.json())
    .then((data) => {
      let videos = data.videos;
      removeActiveClass();
      document.getElementById("btn-all").classList.add("active");
      displayVideo(videos);
    });
}

function loadCategoryVideos(categoryId) {
  let apiLink = `https://openapi.programming-hero.com/api/phero-tube/category/${categoryId}`;
  //   console.log(apiLink);
  fetch(apiLink)
    .then((res) => res.json())
    .then((data) => {
      let videos = data.category;
      removeActiveClass();
      document.getElementById(`btn-${categoryId}`).classList.add("active");
      //   console.log(videos);

      displayVideo(videos);
    });
}

function loadVideoDetails(Id) {
  console.log(Id);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${Id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video));
}

function displayVideoDetails(video) {
  const modalContainer = document.getElementById("modal-box");
  const previousContent = document.getElementById("mod-details");
  if (previousContent) {
    previousContent.remove();
  }

  const div = document.createElement("div");
  div.id = "mod-details";
  div.innerHTML = `
    <h3 class="text-lg font-bold">${video.title}</h3>
    <p class="py-4">${video.description}</p>
  `;
  modalContainer.prepend(div);
  document.getElementById("video_details_modal").showModal();
}

function display(categories) {
  const categoryContainer = document.getElementById("category-container");
  for (const cat of categories) {
    const btn = document.createElement("div");
    btn.innerHTML = `
    <button onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:text-white hover:bg-red-600" id="btn-${cat.category_id}" >${cat.category}</button>
    `;
    categoryContainer.appendChild(btn);
  }
}

const displayVideo = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  if (videos.length === 0) {
    videoContainer.innerHTML = `
    <div
            class="col-span-full mt-20 flex flex-col items-center justify-center"
          >
            <img src="./public/assets/Icon.png" alt="" />
            <h1 class="text-2xl">Opps! There's no content here</h1>
          </div>
        </div>
    `;
  }
  videos.forEach((video) => {
    // console.log(video);

    const card = document.createElement("div");
    card.innerHTML = `
    <div class="card bg-base-100  overflow-hidden cursor-pointer">
        <figure class="relative">
            <img
            src="${video.thumbnail}" class="h-[150px] object-cover w-full" />
            <span class="absolute bottom-2 right-3 text-xs text-white bg-gray-800 px-2 py-1 rounded">${video.others.posted_date ? getDate(video.others.posted_date) : "00:00:00"}</span>
        </figure>
        <div class="flex py-3 items-start gap-2 px-0">
            <div class="avatar">
                <div class="w-10 rounded-full">
                    <img src="${video.authors[0].profile_picture}" alt="${video.authors[0].profile_name}" />
                </div>
            </div>
            <div>
                <h2 class="card-title">${video.title}</h2>
                <p class="text-sm text-gray-500 flex items-center gap-2">${video.authors[0].profile_name} ${video.authors[0].verified ? '<img class="h-4 w-4" src="https://cdn-icons-png.flaticon.com/128/6270/6270448.png" />' : ""}  </p>
                <p class="text-xs text-gray-500">${video.others.views} views</p>
            </div>
        </div>
        <button onclick="loadVideoDetails('${video.video_id}')" class="btn w-full btn-sm">See Details</button>
    </div>
    `;
    videoContainer.appendChild(card);
  });
};

function getDate(str) {
  const date = new Date(str);
  return `${date.getHours()} hrs ${date.getMinutes()} min ago`;
}

document.getElementById("search").addEventListener("keyup", (event) => {
  let kwrd = event.target.value;
  loadVideos(kwrd);
});

loadCategory();
loadVideos();
// window.loadVideos = loadVideos;
