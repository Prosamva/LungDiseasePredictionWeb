const sections = [
  document.getElementById("main"),
  document.getElementById("loader"),
  document.getElementById("result"),
];

const probs = [
  document.getElementById("bp"),
  document.getElementById("cv"),
  document.getElementById("nm"),
  document.getElementById("tb"),
  document.getElementById("vp"),
];

const details = [
  document.getElementById("bp-p"),
  document.getElementById("cv-p"),
  document.getElementById("nm-p"),
  document.getElementById("tb-p"),
  document.getElementById("vp-p"),
];

const progressColors = ["#21cb60", "#ffb700", "#ff7300", "#ff0033"];

const submitButton = document.getElementById("submit");
const userImage = document.getElementById("usr-img");
const errorMessage = document.getElementById("error");

function toggleSection(index) {
  for (let section of sections) {
    section.style.display = "none";
  }
  sections[index].style.display = "block";
}

toggleSection(0);

function toggleDetails(index) {
  for (let detail of details) {
    detail.style.display = "none";
  }
  details[index].style.display = "block";
}

document.getElementById("img-inp").onchange = () =>
  (errorMessage.style.display = "none");

document.getElementById("upload-form").onsubmit = async (event) => {
  event.preventDefault();
  if (errorMessage.style.display != "none") return;
  toggleSection(1);
  const formData = new FormData(event.target);
  const reader = new FileReader();
  reader.onload = (e) => {
    userImage.src = e.target.result;
  };
  reader.readAsDataURL(formData.get("image"));
  const res = await fetch("/upload-image", {
    method: "POST",
    enctype: "multipart/form-data",
    body: formData,
  });
  const result = await res.json();
  console.log(result);

  if (!result.success) {
    errorMessage.style.display = "flex";
    toggleSection(0);
    return;
  }

  for (let i = 0; i < result.probs.length; ++i) {
    const value = result.probs[i];
    const color =
      progressColors[
        i == 2
          ? Math.max(0, progressColors.length - Math.floor(value / 25) - 1)
          : Math.min(3, Math.floor(value / 25))
      ];
    const circle = probs[i].children[0];
    circle.style.backgroundImage = `conic-gradient(${color} ${value}%, ${color}32 0)`;
    circle.children[0].innerHTML = value + "%";

    if (result.type == i) {
      toggleDetails(i);
      const st = details[i].getElementsByClassName("st")[0];
      st.style.color = color;
    }
  }
  toggleSection(2);
};

document.getElementById("back-button").onclick = () => toggleSection(0);

for (let expandables of document.getElementsByClassName("expandables")) {
  expandables = expandables.getElementsByClassName("expandable");
  for (let expandable of expandables) {
    expandable.children[0].onclick = () => {
      if (!expandable.classList.contains("active")) {
        for (let e of expandables) {
          e.classList.remove("active");
        }
      }
      expandable.classList.toggle("active");
    };
  }
}
