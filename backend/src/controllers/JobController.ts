import { Request, Response } from "express";
import mongoose from "mongoose";
import Job from "../models/Job";
import User from "../models/User";
import Company from "../models/Company";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "firstName lastName")
      .populate("company");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching jobs",
      error,
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id)
      .populate("recruiter", "firstName lastName")
      .populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching job",
      error,
    });
  }
};

export const createJob = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { title, description, requirements, company, location, salary } =
    req.body;

  try {
    // Vérifier si l'utilisateur a créé des entreprises
    const user = await User.findById(userId).populate("companies");
    if (!user || !user.companies || user.companies.length === 0) {
      return res
        .status(403)
        .json({ message: "You must have created a company to post a job" });
    }

    // Vérifier si l'entreprise appartient à l'utilisateur
    const companyExists = user.companies.some(
      (comp: any) => comp._id.toString() === company
    );
    if (!companyExists) {
      return res
        .status(403)
        .json({ message: "You can only post jobs for your own companies" });
    }

    const newJob = new Job({
      title,
      description,
      requirements,
      company,
      location,
      salary,
      recruiter: userId,
      datePosted: new Date(),
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: "Error creating job",
      error,
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, requirements, company, location, salary } =
    req.body;
  const userId = (req as any).user.id;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Vérifier si l'utilisateur est le recruteur
    if (job.recruiter.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own job postings" });
    }

    // Mettre à jour les informations de l'offre d'emploi
    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements;
    if (company) job.company = company;
    if (location) job.location = location;
    if (salary) job.salary = salary;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: "Error updating job",
      error,
    });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Vérifier si l'utilisateur est le recruteur
    if (job.recruiter.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own job postings" });
    }

    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting job",
      error,
    });
  }
};
