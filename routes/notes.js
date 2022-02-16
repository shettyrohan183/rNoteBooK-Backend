const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../modules/Notes");
const { body, validationResult } = require("express-validator");

// route 1 : get all the notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error occured");
  }
});


// route 2 : add the notes using post
router.post("/addnotes",fetchuser,[
    body("title", "Enter Valid title").isLength({ min: 3 }),
    body("description", "description must be at least 5 character").isLength({min: 5,}),],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are error return bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      })
      const savedNote = await notes.save();
      res.json(savedNote);
    } catch (error) {
        console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);



module.exports = router;
