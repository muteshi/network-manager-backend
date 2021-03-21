const express = require("express");
const auth = require("../middleware/auth");
const Site = require("../models/site");
const router = new express.Router();

// Add new site
router.post("/sites", auth, async (req, res) => {
  const newSite = new Site({ ...req.body, owner: req.user._id });
  try {
    await newSite.save();
    res.status(201).send(newSite);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all sites
router.get("/sites", auth, async (req, res) => {
  if (!req.user.active) return res.status(401).send();
  const sort = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  //for getting all sites
  const sites = await Site.find({});

  // get sites from a specific user
  try {
    await req.user
      .populate({
        path: "sites",
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    const data = req.user.role === "superuser" ? sites : req.user.sites;

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch single site information
router.get("/sites/:id", auth, async (req, res) => {
  if (!req.user.active) return res.status(401).send();
  const siteId = req.params.id;

  try {
    const site = await Site.findById(siteId);
    if (site.owner.toString() !== req.user._id.toString()) {
      return res.status(404).send();
    }

    res.send(site);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a site information
router.patch("/sites/edit/:id", auth, async (req, res) => {
  if (!req.user.active) return res.status(401).send();
  const updates = Object.keys(req.body);

  try {
    const site = await Site.findOne({
      _id: req.params.id,
    });

    if (
      !(
        req.user.role === "superuser" ||
        site.owner.toString() === req.user._id.toString()
      )
    )
      return res.status(401).send();

    updates.forEach((update) => (site[update] = req.body[update]));
    await site.save();

    res.send(site);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a site
router.delete("/sites/delete/:id", auth, async (req, res) => {
  if (req.user.role !== "superuser")
    return res
      .status(401)
      .send({ error: "Unauthorized to perform this action" });
  try {
    const site = await Site.findOneAndDelete({
      _id: req.params.id,
    });
    if (!site) {
      return res.status(404).send();
    }
    res.send(site);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
