// src/redux/features/company/companySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosConfig";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Company {
  _id: string;
  companyName: string;
  companyRegistrationNumber: string;
  address: Address;
  numberOfEmployees: number;
  industryType: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  description?: string;
  foundedDate?: Date;
  logo?: string;
  socialMediaLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  companySize?: "small" | "medium" | "large";
  headquarterLocation?: string;
  subsidiaries?: string[];
  certifications?: string[];
}

interface CompanyState {
  companies: Company[];
  company: Company | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  company: null,
  status: "idle",
  error: null,
};

export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async () => {
    const response = await axiosInstance.get("/companies");
    return response.data;
  }
);

export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (id: string) => {
    const response = await axiosInstance.get(`/companies/${id}`);
    return response.data;
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({
    id,
    companyData,
  }: {
    id: string;
    companyData: Partial<Company>;
  }) => {
    const response = await axiosInstance.put(`/companies/${id}`, companyData);
    return response.data;
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id: string) => {
    await axiosInstance.delete(`/companies/${id}`);
    return id;
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCompanies.fulfilled,
        (state, action: PayloadAction<Company[]>) => {
          state.status = "succeeded";
          state.companies = action.payload;
        }
      )
      .addCase(getCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch companies";
      })
      .addCase(getCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCompanyById.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          state.company = action.payload;
        }
      )
      .addCase(getCompanyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch company";
      })
      .addCase(updateCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          state.company = action.payload;
        }
      )
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update company";
      })
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.companies = state.companies.filter(
            (company) => company._id !== action.payload
          );
        }
      )
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete company";
      });
  },
});

export default companySlice.reducer;