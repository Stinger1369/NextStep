// src/controllers/JobController.ts
import { Request, Response } from "express";
import Job from "../models/Job";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().populate(
      "recruiter",
      "firstName lastName email"
    );
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id).populate(
      "recruiter",
      "firstName lastName email"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};

export const createJob = async (req: Request, res: Response) => {
  const { title, description, requirements, company, location, salary } =
    req.body;
  const recruiter = (req as any).user.id;

  try {
    const job = new Job({
      title,
      description,
      requirements,
      company,
      location,
      salary,
      recruiter,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, requirements, company, location, salary } =
    req.body;

  try {
    const job = await Job.findByIdAndUpdate(
      id,
      {
        title,
        description,
        requirements,
        company,
        location,
        salary,
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};
