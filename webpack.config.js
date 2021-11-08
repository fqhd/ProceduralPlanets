const path = require("path");

module.exports = {
	entry: "./js/main.js",
	output: {
		filename: "out.js",
		path: path.join(__dirname, "dist/")
	}
};