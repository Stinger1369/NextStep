// src/controllers/ApplicationController.ts
import { Request, Response } from "express";
import Application from "../models/Application";
import Job from "../models/Job";
import User from "../models/User";

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find()
      .populate("job", "title")
      .populate("jobSeeker", "firstName lastName email");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await Application.findById(id)
      .populate("job", "title")
      .populate("jobSeeker", "firstName lastName email");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Error fetching application", error });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  const { job, coverLetter, resume } = req.body;
  const jobSeeker = (req as any).user.id;

  try {
    // Vérifier si l'offre d'emploi existe
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Vérifier si l'utilisateur existe et est un chercheur d'emploi
    const user = await User.findById(jobSeeker);
    if (!user || user.userType !== "jobSeeker") {
      return res.status(400).json({ message: "User is not a job seeker" });
    }

    const application = new Application({
      job,
      jobSeeker,
      coverLetter,
      resume,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Error creating application", error });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating application status", error });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application", error });
  }
};
