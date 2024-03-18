const express = require("express");
const { connectToMongoDb } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express();
const path = require("path");
const staticRoute = require("./routes/staticRouter");
const PORT = 8001;

connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("mongodb connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/test", async (req, res) => {
  const allurls = await URL.find({});
  return res.render("home", {
    urls: allurls,
  });
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  console.log("Searching for shortId:", shortId);
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  console.log("Found entry:", entry);
  if (!entry) {
    console.log("No entry found for shortId:", shortId);
    return res.status(404).send("URL not found");
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`server is started at PORT : ${PORT}`);
});
