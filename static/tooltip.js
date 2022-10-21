const tooltips = document.querySelectorAll(".tooltip");

for (const tooltip of tooltips) {
  tooltip.setAttribute("data-title", tooltip.getAttribute("title"));
  tooltip.removeAttribute("title");
}

const tooltip = document.createElement("div");
const tooltipContent = document.createElement("p");
tooltip.classList.add("popover");
tooltipContent.classList.add("popover-content");
tooltip.appendChild(tooltipContent);

/**
 *
 * @param {HTMLElement} element
 * @param {DOMRect} rect
 */
function detectCollision(element, rect) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const x = -tooltipRect.width / 2;
  let translate = `translateX(${x}px)`;
  const borderWidth = parseInt(getComputedStyle(document.body).borderWidth);

  const isCollidingRight =
    tooltipRect.left + tooltipRect.width + x >
    document.documentElement.clientWidth - borderWidth;

  const isCollidingLeft = tooltipRect.left + x < borderWidth;

  if (isCollidingRight) {
    let dX =
      document.documentElement.clientWidth -
      (tooltipRect.left + tooltipRect.width + x) -
      borderWidth;
    console.log({ x, dX });
    translate = `translateX(${x + dX}px)`;
  }

  if (isCollidingLeft) {
    let dX = x - tooltipRect.left + borderWidth;
    translate = `translateX(${dX - x}px)`;
    console.log({ translate, x, dX });
  }

  tooltip.style.transform = translate;
}

/**
 *
 * @param {HTMLElement} target
 */
function showTooltip(target) {
  tooltipContent.innerText = target.dataset["title"];
  const rect = target.getBoundingClientRect();
  target.appendChild(tooltip);
  detectCollision(target, rect);
}

/**
 *
 * @param {HTMLElement} target
 */
function hideTooltip() {
  tooltipContent.innerText = "";
  tooltip.parentElement.removeChild(tooltip);
  tooltip.style.transform = "";
}

if (!!navigator.maxTouchPoints) {
  let active = false;

  document.addEventListener("touchstart", (event) => {
    if (active) {
      hideTooltip();
      active = false;
    }
    if (!event.touches[0].target.classList?.contains("tooltip")) return;
    event.preventDefault();
    event.stopPropagation();
    showTooltip(event.target);
    active = true;
  });
} else {
  document.addEventListener("mouseover", (event) => {
    if (!event.target.classList?.contains("tooltip")) return;
    event.preventDefault();
    console.log("mouseover");
    showTooltip(event.target);
  });

  document.addEventListener("mouseout", (event) => {
    if (!event.target.classList?.contains("tooltip")) return;
    hideTooltip();
  });
}
