// src/controllers/CompanyController.ts

import { Request, Response } from "express";
import Company from "../models/Company";
import User from "../models/User";

export const createCompany = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const {
    companyName,
    companyRegistrationNumber,
    address,
    numberOfEmployees,
    industryType,
    contactEmail,
    contactPhone,
    website,
    description,
    foundedDate,
    logo,
    socialMediaLinks,
    companySize,
    headquarterLocation,
    subsidiaries,
    certifications,
  } = req.body;

  try {
    const newCompany = new Company({
      companyName,
      companyRegistrationNumber,
      address,
      numberOfEmployees,
      industryType,
      contactEmail,
      contactPhone,
      website,
      description,
      foundedDate,
      logo,
      socialMediaLinks,
      companySize,
      headquarterLocation,
      subsidiaries,
      certifications,
    });

    const company = await newCompany.save();

    // Update user's company references
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { companies: company._id } },
      { new: true, upsert: true }
    );

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: "Error creating company",
      error,
    });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    companyName,
    companyRegistrationNumber,
    address,
    numberOfEmployees,
    industryType,
    contactEmail,
    contactPhone,
    website,
    description,
    foundedDate,
    logo,
    socialMediaLinks,
    companySize,
    headquarterLocation,
    subsidiaries,
    certifications,
  } = req.body;

  try {
    const updateData: any = {
      ...(companyName && { companyName }),
      ...(companyRegistrationNumber && { companyRegistrationNumber }),
      ...(address && { address }),
      ...(numberOfEmployees && { numberOfEmployees }),
      ...(industryType && { industryType }),
      ...(contactEmail && { contactEmail }),
      ...(contactPhone && { contactPhone }),
      ...(website && { website }),
      ...(description && { description }),
      ...(foundedDate && { foundedDate }),
      ...(logo && { logo }),
      ...(socialMediaLinks && { socialMediaLinks }),
      ...(companySize && { companySize }),
      ...(headquarterLocation && { headquarterLocation }),
      ...(subsidiaries && { subsidiaries }),
      ...(certifications && { certifications }),
    };

    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
      upsert: true,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({
      message: "Error updating company",
      error,
    });
  }
};

export const getCompanies = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const user = await User.findById(userId).populate("companies");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company", error });
  }
};

export const deleteCompany = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};
