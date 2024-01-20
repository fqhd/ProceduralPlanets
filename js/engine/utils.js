export function get_random_color(){
	const r = Math.random();
	const g = Math.random();
	const b = Math.random();
	return [r, g, b];
}

export function hsv_to_rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
}

export function load_image(url){
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.src = url;
	});
}

export function fill_arr_to_length(arr, len){
	const diff = len - arr.length;
	if(len > 0){
		for(let i = 0; i < diff; i++){
			arr.push(0);
		}
	}
}

export function get_resolution_from_num(n){
	for(let i = 0; i < n; i++){
		// const num_pow_2 = Math.pow(2, i);
		if(Math.pow(i, 2) >= n){
			return {
				width: i,
				height: i,
			}
		}
	}
}

function random_string(length) {
	const characters = 'abcdefghijklmnopqrstuvwxyz';
	let randomString = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(randomIndex);
	}

	return randomString;
}

export function download_image() {
    // Get the canvas element
    var canvas = document.getElementById("canvas");

    // Get the data URL of the canvas content as JPEG
    var dataURL = canvas.toDataURL("image/jpeg");

    // Create a temporary link element
    var link = document.createElement('a');

    // Set the href attribute with the data URL
    link.href = dataURL;

	link.download = random_string(16) + '.jpg';


    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click event on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}