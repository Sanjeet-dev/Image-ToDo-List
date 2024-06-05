document.addEventListener("DOMContentLoaded", function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");
  const carousel = document.querySelector(".carousel");
  const MAX_IMAGES = 5;

  // Load images from local storage
  loadFromLocalStorage();

  // Drag and Drop functionality
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (files.length + fileList.children.length > MAX_IMAGES) {
      alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only images are allowed.");
        continue;
      }
      if (file.size > 1 * 1024 * 1024) {
        alert("Image size should be less than 1 MB.");
        continue;
      }

      displayFile(file);
    }
  }

  function displayFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const div = document.createElement("div");
      div.className = "file-item";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;
      img.className = "thumbnail";
      div.appendChild(img);

      const description = document.createElement("textarea");
      description.className = "description";
      description.placeholder = "Add description here...";
      div.appendChild(description);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("click", () => {
        description.disabled = !description.disabled;
        if (description.disabled) {
          alert("Description added");
        }
        saveToLocalStorage();
      });
      div.appendChild(checkbox);

      const deleteIcon = document.createElement("span");
      deleteIcon.className = "material-icons";
      deleteIcon.innerText = "delete";
      deleteIcon.addEventListener("click", () => {
        div.remove();
        saveToLocalStorage();
      });
      div.appendChild(deleteIcon);

      fileList.appendChild(div);
      addImageToCarousel(e.target.result);
      saveToLocalStorage();
    };
    reader.readAsDataURL(file);
  }

  function addImageToCarousel(src) {
    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Carousel Image";
    carouselItem.appendChild(img);

    carousel.appendChild(carouselItem);

    // Update carousel transition
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
      item.style.opacity = (index === 0) ? 1 : 0;
    });
  }

  function saveToLocalStorage() {
    const imagesData = [];
    fileList.querySelectorAll(".file-item").forEach((div) => {
      const img = div.querySelector("img");
      const description = div.querySelector("textarea");
      const checkbox = div.querySelector("input[type='checkbox']");
      imagesData.push({
        src: img.src,
        description: description.value,
        disabled: description.disabled,
        checked: checkbox.checked
      });
    });
    localStorage.setItem("storedImagesData", JSON.stringify(imagesData));
  }

  function loadFromLocalStorage() {
    const storedImagesData = JSON.parse(localStorage.getItem("storedImagesData") || "[]");
    storedImagesData.forEach((data) => {
      const div = document.createElement("div");
      div.className = "file-item";

      const img = document.createElement("img");
      img.src = data.src;
      img.className = "thumbnail";
      div.appendChild(img);

      const description = document.createElement("textarea");
      description.className = "description";
      description.value = data.description;
      description.disabled = data.disabled;
      div.appendChild(description);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = data.checked;
      checkbox.addEventListener("click", () => {
        description.disabled = !description.disabled;
        if (description.disabled) {
          alert("Description added");
        }
        saveToLocalStorage();
      });
      div.appendChild(checkbox);

      const deleteIcon = document.createElement("span");
      deleteIcon.className = "material-icons";
      deleteIcon.innerText = "delete";
      deleteIcon.addEventListener("click", () => {
        div.remove();
        saveToLocalStorage();
      });
      div.appendChild(deleteIcon);

      fileList.appendChild(div);
      addImageToCarousel(data.src);
    });

    // Initialize carousel
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
      item.style.opacity = (index === 0) ? 1 : 0;
    });
  }

  // Carousel functionality
  let index = 0;
  setInterval(() => {
    const items = document.querySelectorAll('.carousel-item');
    items[index].style.opacity = 0;
    index = (index + 1) % items.length;
    items[index].style.opacity = 1;
  }, 3000);
});
