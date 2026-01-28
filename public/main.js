const form = document.getElementById("form");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData();
  fd.append("media", file.files[0]);
  fd.append("title", title.value);

  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  progressContainer.style.display = "block";
  progressBar.value = 0;
  progressText.textContent = "0%";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload");
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.value = percent;
      progressText.textContent = percent + "%";
    }
  };
  xhr.onload = function() {
    progressBar.value = 100;
    progressText.textContent = "100%";
    alert("Uploaded!");
    progressContainer.style.display = "none";
  };
  xhr.onerror = function() {
    alert("Upload failed.");
    progressContainer.style.display = "none";
  };
  xhr.send(fd);
});

window.loadMedia = async function loadMedia(){
  const res = await fetch("/media");
  const data = await res.json();
  list.innerHTML = "";

  data.forEach(item=>{
    const div = document.createElement("div");
    div.className="card";

    let media = "";
    if (item.resourceType === "video") {
      media = `<video src="${item.imageUrl}" controls></video>`;
    } else {
      media = `<img src="${item.imageUrl}"/>`;
    }

    div.innerHTML = media + `<p>${item.title}</p>` +
      `<button onclick=\"delMedia('${item._id}')\">Delete</button>`;

    list.appendChild(div);
  });
}

window.delMedia = async function delMedia(id){
  await fetch("/media/"+id, {method:"DELETE"});
  loadMedia();
}
