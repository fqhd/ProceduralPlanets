const express = require("express");
const path = require("path");
const app = express();
const port = 5000;

app.use("/dist", express.static(path.join(__dirname, "dist/")));
app.use("/res", express.static(path.join(__dirname, "res/")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"), (error) => {
		if (error) {
			console.log(error);
		}
	});
});


app.listen(port, () => {
	console.log(`listening on port ${port}`);
})