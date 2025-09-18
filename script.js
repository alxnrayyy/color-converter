const colorDisplay = document.getElementById('colorDisplay');
const hexValue = document.getElementById('hexValue');
const colorPicker = document.getElementById('colorPicker');

const rSlider = document.getElementById('rSlider');
const rInput = document.getElementById('rInput');
const gSlider = document.getElementById('gSlider');
const gInput = document.getElementById('gInput');
const bSlider = document.getElementById('bSlider');
const bInput = document.getElementById('bInput');

const xInput = document.getElementById('xInput');
const yInput = document.getElementById('yInput');
const zInput = document.getElementById('zInput');

const cSlider = document.getElementById('cSlider');
const cInput = document.getElementById('cInput');
const mSlider = document.getElementById('mSlider');
const mInput = document.getElementById('mInput');
const ySliderCmyk = document.getElementById('ySliderCmyk');
const yInputCmyk = document.getElementById('yInputCmyk');
const kSlider = document.getElementById('kSlider');
const kInput = document.getElementById('kInput');

const rWarning = document.getElementById('rWarning');
const gWarning = document.getElementById('gWarning');
const bWarning = document.getElementById('bWarning');
const xWarning = document.getElementById('xWarning');
const yWarning = document.getElementById('yWarning');
const zWarning = document.getElementById('zWarning');
const cWarning = document.getElementById('cWarning');
const mWarning = document.getElementById('mWarning');
const yCmykWarning = document.getElementById('yCmykWarning');
const kWarning = document.getElementById('kWarning');

let currentRgb = { r: 74, g: 111, b: 165 };

function updateUI() {
    colorDisplay.style.backgroundColor = `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
    
    rSlider.value = currentRgb.r;
    rInput.value = currentRgb.r;
    gSlider.value = currentRgb.g;
    gInput.value = currentRgb.g;
    bSlider.value = currentRgb.b;
    bInput.value = currentRgb.b;
    
    const xyz = rgbToXyz(currentRgb.r, currentRgb.g, currentRgb.b);
    xInput.value = xyz.x.toFixed(2);
    yInput.value = xyz.y.toFixed(2);
    zInput.value = xyz.z.toFixed(2);
    
    const cmyk = rgbToCmyk(currentRgb.r, currentRgb.g, currentRgb.b);
    cSlider.value = cmyk.c;
    cInput.value = cmyk.c;
    mSlider.value = cmyk.m;
    mInput.value = cmyk.m;
    ySliderCmyk.value = cmyk.y;
    yInputCmyk.value = cmyk.y;
    kSlider.value = cmyk.k;
    kInput.value = cmyk.k;
    
    colorPicker.value = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
    
    hexValue.textContent = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b).toUpperCase();
    
    const brightness = (currentRgb.r * 299 + currentRgb.g * 587 + currentRgb.b * 114) / 1000;
    colorDisplay.style.color = brightness > 128 ? 'black' : 'white';
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToXyz(r, g, b) {
    let rn = r / 255;
    let gn = g / 255;
    let bn = b / 255;
    
    function f(c) {
        return c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
    }
    
    rn = f(rn) * 100;
    gn = f(gn) * 100;
    bn = f(bn) * 100;
    
    const x = 0.412453 * rn + 0.357580 * gn + 0.180423 * bn;
    const y = 0.212671 * rn + 0.715160 * gn + 0.072169 * bn;
    const z = 0.019334 * rn + 0.119193 * gn + 0.950227 * bn;
    
    return { x, y, z };
}

function xyzToRgb(x, y, z) {
    const xn = x / 100;
    const yn = y / 100;
    const zn = z / 100;
    
    let rn = 3.2406 * xn - 1.5372 * yn - 0.4986 * zn;
    let gn = -0.9689 * xn + 1.8758 * yn + 0.0415 * zn;
    let bn = 0.0557 * xn - 0.2040 * yn + 1.0570 * zn;
    
    function fInv(c) {
        return c >= 0.0031308 ? 1.055 * Math.pow(c, 1/2.4) - 0.055 : 12.92 * c;
    }
    
    rn = fInv(rn);
    gn = fInv(gn);
    bn = fInv(bn);
    
    let r = Math.round(rn * 255);
    let g = Math.round(gn * 255);
    let b = Math.round(bn * 255);
    
    let warnings = {
        r: r < 0 || r > 255,
        g: g < 0 || g > 255,
        b: b < 0 || b > 255
    };
    
    r = Math.min(Math.max(r, 0), 255);
    g = Math.min(Math.max(g, 0), 255);
    b = Math.min(Math.max(b, 0), 255);
    
    return { r, g, b, warnings };
}

function rgbToCmyk(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    
    const k = 1 - Math.max(rn, gn, bn);
    
    const c = k === 1 ? 0 : (1 - rn - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gn - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bn - k) / (1 - k);
    
    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

function cmykToRgb(c, m, y, k) {
    const cn = c / 100;
    const mn = m / 100;
    const yn = y / 100;
    const kn = k / 100;
    
    const r = 255 * (1 - cn) * (1 - kn);
    const g = 255 * (1 - mn) * (1 - kn);
    const b = 255 * (1 - yn) * (1 - kn);
    
    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };
}

function setupRgbListeners() {
    rSlider.addEventListener('input', () => {
        rInput.value = rSlider.value;
        currentRgb.r = parseInt(rSlider.value);
        updateUI();
    });
    
    gSlider.addEventListener('input', () => {
        gInput.value = gSlider.value;
        currentRgb.g = parseInt(gSlider.value);
        updateUI();
    });
    
    bSlider.addEventListener('input', () => {
        bInput.value = bSlider.value;
        currentRgb.b = parseInt(bSlider.value);
        updateUI();
    });
    
    rInput.addEventListener('input', () => {
        let value = parseInt(rInput.value) || 0;
        if (value < 0) value = 0;
        if (value > 255) value = 255;
        
        rInput.value = value;
        rSlider.value = value;
        currentRgb.r = value;
        updateUI();
    });
    
    gInput.addEventListener('input', () => {
        let value = parseInt(gInput.value) || 0;
        if (value < 0) value = 0;
        if (value > 255) value = 255;
        
        gInput.value = value;
        gSlider.value = value;
        currentRgb.g = value;
        updateUI();
    });
    
    bInput.addEventListener('input', () => {
        let value = parseInt(bInput.value) || 0;
        if (value < 0) value = 0;
        if (value > 255) value = 255;
        
        bInput.value = value;
        bSlider.value = value;
        currentRgb.b = value;
        updateUI();
    });
}

function setupXyzListeners() {
    xInput.addEventListener('input', () => {
        let x = parseFloat(xInput.value) || 0;
        let y = parseFloat(yInput.value) || 0;
        let z = parseFloat(zInput.value) || 0;
        
        x = Math.min(Math.max(x, 0), 95.05);
        y = Math.min(Math.max(y, 0), 100);
        z = Math.min(Math.max(z, 0), 108.9);
        
        xInput.value = x.toFixed(2);
        yInput.value = y.toFixed(2);
        zInput.value = z.toFixed(2);
        
        const rgb = xyzToRgb(x, y, z);
        currentRgb = rgb;
        
        rWarning.style.display = rgb.warnings.r ? 'block' : 'none';
        gWarning.style.display = rgb.warnings.g ? 'block' : 'none';
        bWarning.style.display = rgb.warnings.b ? 'block' : 'none';
        
        updateUI();
    });
    
    yInput.addEventListener('input', xInput.oninput);
    zInput.addEventListener('input', xInput.oninput);
}

function setupCmykListeners() {
    cSlider.addEventListener('input', () => {
        cInput.value = cSlider.value;
        updateFromCmyk();
    });
    
    mSlider.addEventListener('input', () => {
        mInput.value = mSlider.value;
        updateFromCmyk();
    });
    
    ySliderCmyk.addEventListener('input', () => {
        yInputCmyk.value = ySliderCmyk.value;
        updateFromCmyk();
    });
    
    kSlider.addEventListener('input', () => {
        kInput.value = kSlider.value;
        updateFromCmyk();
    });
    
    cInput.addEventListener('input', () => {
        let value = parseInt(cInput.value) || 0;
        if (value < 0) value = 0;
        if (value > 100) value = 100;
        
        cInput.value = value;
        cSlider.value = value;
        updateFromCmyk();
    });
    
    mInput.addEventListener('input', () => {
        let value = parseInt(mInput.value) || 0;
        if (value < 0) value = 0;
        if (value > 100) value = 100;
        
        mInput.value = value;
        mSlider.value = value;
        updateFromCmyk();
    });
    
    yInputCmyk.addEventListener('input', () => {
        let value = parseInt(yInputCmyk.value) || 0;
        if (value < 0) value = 0;
        if (value > 100) value = 100;
        
        yInputCmyk.value = value;
        ySliderCmyk.value = value;
        updateFromCmyk();
    });
    
    kInput.addEventListener('input', () => {
        let value = parseInt(kInput.value) || 0;
        if (value < 0) value = 0;
        if (value > 100) value = 100;
        
        kInput.value = value;
        kSlider.value = value;
        updateFromCmyk();
    });
    
    function updateFromCmyk() {
        const c = parseInt(cInput.value);
        const m = parseInt(mInput.value);
        const y = parseInt(yInputCmyk.value);
        const k = parseInt(kInput.value);
        
        currentRgb = cmykToRgb(c, m, y, k);
        updateUI();
    }
}

function setupColorPickerListener() {
    colorPicker.addEventListener('input', () => {
        const hex = colorPicker.value;
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        
        currentRgb = { r, g, b };
        updateUI();
    });
}

function init() {
    setupRgbListeners();
    setupXyzListeners();
    setupCmykListeners();
    setupColorPickerListener();
    updateUI();
}

document.addEventListener('DOMContentLoaded', init);
