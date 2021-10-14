import express from "express"
import createHttpError from "http-errors"
import experiencesModel from "./schema.js"

const experiencesRouter = express.Router()
experiencesRouter.get("/", async (req, res, next)=>{
    try {
        const experiences = await experiencesModel.find()
        res.send(experiences)
    } catch (error) {
        next(error)
    }
})
experiencesRouter.get("/:id", async (req, res, next)=>{
    try {
      const experienceId = req.params.id  
      const experience = await experiencesModel.findById(experienceId)
      if (experience){
          res.send(experience)
      } else {
        next(createHttpError(404,`experience with id ${req.params.id} doesn't exist`))
      }
    } catch (error) {
        next(error)
    }
})
experiencesRouter.post("/", async (req, res, next)=>{
    try {
        const newExperience = new experiencesModel(req.body)
        const experience = await newExperience.save()
        res.status(201).send(experience)
    } catch (error) {
        next(error)
    }
})
experiencesRouter.put("/:id", async (req, res, next)=>{
    try {
        const experience = await experiencesModel.findById(req.params.id)
        const modifiedExperience = await experiencesModel.findByIdAndUpdate(experience, req.body, {
            new: true
        })
        if (modifiedExperience){
            res.send(modifiedExperience)
        } else {
            next(createHttpError(404,`experience with id ${req.params.id} doesn't exist`))
        }
    } catch (error) {
        next(error)
    }
})
experiencesRouter.delete("/:id", async (req, res, next)=>{
    try {
      const experience = await experiencesModel.findById(req.params.id) 
      const deletedExperience = await experiencesModel.findByIdAndDelete(experience) 
      if (deletedExperience){
          res.status(204)
      } else {
          next(createHttpError(404,`experience with id ${req.params.id} doesn't exist`))
      }
    } catch (error) {
        next(error)
    }
})
export default experiencesRouter