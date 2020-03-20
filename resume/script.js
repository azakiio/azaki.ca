const color_list = {
    "Green": "#34A853",
    "Blue": "#4285F4",
    "Yellow": "#FBBC05",
    "Red": "#EA4335",
    "Lime": "#a4c400",
    "Emerald": "#008a00",
    "Teal": "#00aba9",
    "Cyan": "#1ba1e2",
    "Cobalt": "#0050ef",
    "Indigo": "#6a00ff",
    "Violet": "#aa00ff",
    "Pink": "#f472d0",
    "Magenta": "#d80073",
    "Crimson": "#a20025",
    "Orange": "#fa6800",
    "Amber": "#f0a30a",
    "Brown": "#825a2c",
    "Olive": "#6d8764",
    "Steel": "#647687",
    "Mauve": "#76608a",
    "Taupe": "#87794e",
    "Sienna": "#a0522d",
}

if (localStorage.getItem("fav_color") != null) {
    setColor(localStorage.getItem("fav_color"))

}

var color_select = document.getElementById("color_picker")

for (var color of Object.keys(color_list)) {
    var option = document.createElement("option")
    option.innerText = color
    option.value = color
    color_select.appendChild(option)
}

function setColor(value) {
    document.documentElement.style.setProperty('--accent-color', color_list[value]);
    localStorage.setItem("fav_color", value)
}

var prevScroll = window.scrollY;
window.onscroll = function () {
    var currentScroll = window.scrollY;
    if (currentScroll > prevScroll) {
        document.getElementById("nav_wrapper").style.top = `-2em`
        prevScroll = currentScroll
    } else {
        document.getElementById("nav_wrapper").style.top = "1.2em"
        prevScroll = currentScroll
    }
}