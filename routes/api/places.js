const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Place = require("../../models/Place");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");

//get all places test route

router.get("/", async (req, res) => {
  try {
    const places = await Place.find().sort({ date: -1 });
    res.json(places);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server error");
  }
});

//Insert New PLace
router.post(
  "/",
  [
    adminAuth,
    [
      check("placeName", "Place Name cannot be empty")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { placeName, placeDescription } = req.body;

      const urlSlug = slugify(placeName, {
        remove: /[*+~.(),#^'"!:@]/g,
        lower: true
      });

      const isExist = await Place.findOne({ urlSlug });

      if (isExist) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "url slug must be unique, Similar place already exists, try changing few characters in the place name"
            }
          ]
        });
      }

      const newPlace = new Place({
        placeName,
        urlSlug,
        placeDescription
      });

      await newPlace.save();
      res.status(200).json({ msg: "Place Added" });
    } catch (err) {
      console.error(err.message);
      
    }
  }
);



//get place details by placeSlug
router.get(`/getPlaceDetailsBySlug/:placeSlug`, async (req,res) => {
  try {
    const { placeSlug } = req.params;
    const place = await Place.findOne({urlSlug : placeSlug});
    res.json(place)
  } catch (err) {
    console.error(err.message);
    res.status(500).json("internal server error")
  }

})

module.exports = router;
