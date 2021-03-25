//Instantiate nedb Database
var datastore = require("nedb"),
  db = new datastore({ filename: "database.json", autoload: true });

//Instantiate App and Express
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
const { response } = require("express");

//Instantiate BodyParser
var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

app.use(express.static("public"));

//EJS Template
app.set("view engine", "ejs");

//Click Sign Up -> Form
app.get("/signup", (req, res) =>
  res.sendFile(__dirname + "/views/signup.html")
);

app.get("/app/:profileId/:userId", (req, res) => {
  const { profileId, userId } = req.params;

  db.find({}, (err, profiles) => {
    const profile = profiles.find((profile) => profile.index == profileId);
    const data = { profile, next: `../${parseInt(profileId) + 1}/${userId}` };
    if (profile.index != userId) {
      res.render("app", data);
    } else {
      res.render("match", data);
    }
  });
});

//Submit Form -> Confirmation Page
app.post("/confirmation", (req, res) => {
  //Data Object
  db.find({}, (err, profiles) => {
    const dataToSave = {
      answer1: req.body.q1,
      answer2: req.body.q2,
      answer3: req.body.q3,
      answer4: req.body.q4,
      answer5: req.body.q5,
      answer6: req.body.q6,
      answer7: req.body.q7,
      answer8: req.body.q8,
      index: profiles.length,
    };

    //nedb Database
    db.insert(dataToSave, function (err, newProfile) {
      const userId = {
        next: `app/0/${newProfile.index}`,
      };
      res.render("confirmation", userId);
    });
  });
});

//Server Listen on a Port
app.listen(80, function () {
  console.log("Example app listening on port 80!");
});
