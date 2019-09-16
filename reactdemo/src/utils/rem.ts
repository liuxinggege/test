/**
 * 动态设置rem
 */

const BASE_SIZE = 20; // 基本字体大小
const MAX_SIZE = 20; // 最大字体大小
const DESIGN_WIDTH = 1920;
const MIN_DESIGN_WIDTH = 1440;

const htmlEl = document.querySelector('html');
let fontSize = 20;

const setFontSize = size => {
    htmlEl.style.fontSize = `${size}px`;
    fontSize = size;
};

const calc = () => {
    const device_width = document.body.clientWidth || window.innerWidth;
    const scale = device_width / DESIGN_WIDTH;
    let distSize = scale * BASE_SIZE;
    if (distSize > MAX_SIZE) {
        distSize = MAX_SIZE;
    }
    if (device_width < MIN_DESIGN_WIDTH) return;
    setFontSize(Math.round(distSize));
};

window.addEventListener('resize', calc);

document.addEventListener('DOMContentLoaded', calc);

(window as any).rem = size => {
    return size / BASE_SIZE + 'rem';
};

(window as any).renderPx = size => {
    return Math.round((size / BASE_SIZE) * fontSize);
};

export default (window as any).rem;
export const renderPx = (window as any).renderPx;
