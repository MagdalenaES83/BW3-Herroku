import express from "express";
import createHttpError from "http-errors";
import profilesModel from "./schema.js";
import { parseFile } from "../../utils/upload.js";
import mongoose from "mongoose";
import fs from "fs";
const profilesRouter = express.Router();
profilesRouter.get("/", async (req, res, next) => {
  try {
    const profiles = await profilesModel.find();
    res.send(profiles);
  } catch (error) {
    next(error);
  }
});
profilesRouter.get("/:id", async (req, res, next) => {
  try {
    const profileId = req.params.id;
    const profile = await profilesModel.findById(profileId);
    if (profile) {
      res.send(profile);
    } else {
      next(
        createHttpError(404, `Profile with id ${req.params.id} doesn't exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
profilesRouter.post("/", async (req, res, next) => {
  try {
    const newProfile = new profilesModel(req.body);
    const profile = await newProfile.save();
    res.status(201).send(profile);
  } catch (error) {
    next(error);
  }
});
profilesRouter.put(
  "/:id/image",
  parseFile.single("image"),
  async (req, res, next) => {
    try {
      const changedProfile = await profilesModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        {
          new: true,
        }
      );

      res.status(201).send(changedProfile);
    } catch (error) {
      next(error);
    }
  }
);
profilesRouter.put("/:id", async (req, res, next) => {
  try {
    const profile = await profilesModel.findById(req.params.id);
    const modifiedProfile = await profilesModel.findByIdAndUpdate(
      profile,
      req.body,
      {
        new: true,
      }
    );
    if (modifiedProfile) {
      res.send(modifiedProfile);
    } else {
      next(
        createHttpError(404, `Profile with id ${req.params.id} doesn't exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
profilesRouter.delete("/:id", async (req, res, next) => {
  try {
    const profile = await profilesModel.findById(req.params.id);
    const deletedProfile = await profilesModel.findByIdAndDelete(profile);
    if (deletedProfile) {
      res.status(204);
    } else {
      next(
        createHttpError(404, `Profile with id ${req.params.id} doesn't exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
export default profilesRouter;
