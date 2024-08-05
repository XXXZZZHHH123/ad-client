// gradientColor.js
export const getGradientColor = (value) => {
    // value 取值范围 0-100
    const hue = ((1 - Math.min(value, 100) / 100) * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
};