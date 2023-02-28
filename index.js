const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const port = 3000;

const filePath = path.join(__dirname, "files");
app.use("/static", express.static(filePath));
app.use(express.json());
app.use(cors());

setInterval(() => {
  const files = fs.readdirSync(filePath);
  files.forEach((file) => {
    const _file = path.join(filePath, file);
    const stats = fs.statSync(_file);
    const fileDate = Date.parse(stats.birthtime);
    const now = new Date();
    const diffTime = Math.abs(now - fileDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 2) {
      fs.unLinkSync(_file);
    }
  });
}, 25000);

app.post("/download", (req, res) => {
  const { markdown } = req.body;
  const filename = `md-${uuid().slice(0, 8)}.md`;
  const fileLocation = path.join(filePath, filename);
  fs.writeFileSync(fileLocation, markdown);
  res.download(fileLocation);
});

app.listen(port, () => console.log("Server started on port", port));
