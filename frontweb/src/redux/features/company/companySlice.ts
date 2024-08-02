// src/redux/features/company/companySlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../axiosConfig';

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
  foundedDate?: Date | null;
  logo?: string;
  socialMediaLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  companySize?: 'small' | 'medium' | 'large';
  headquarterLocation?: string;
  subsidiaries?: string[];
  certifications?: string[];
}

interface CompanyState {
  companies: Company[];
  company: Company | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  company: null,
  status: 'idle',
  error: null
};

export const getCompanies = createAsyncThunk('company/getCompanies', async () => {
  const response = await axiosInstance.get('/companies');
  return response.data;
});

export const getCompanyById = createAsyncThunk('company/getCompanyById', async (id: string) => {
  const response = await axiosInstance.get(`/companies/${id}`);
  return response.data;
});

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (companyData: Partial<Company>) => {
    const response = await axiosInstance.post('/companies', companyData);
    return response.data;
  }
);

export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ id, companyData }: { id: string; companyData: Partial<Company> }) => {
    const response = await axiosInstance.put(`/companies/${id}`, companyData);
    return response.data;
  }
);

export const deleteCompany = createAsyncThunk('company/deleteCompany', async (id: string) => {
  await axiosInstance.delete(`/companies/${id}`);
  return id;
});

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    initNewCompany(state) {
      state.company = {
        _id: '',
        companyName: '',
        companyRegistrationNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        numberOfEmployees: 0,
        industryType: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        description: '',
        foundedDate: null,
        logo: '',
        socialMediaLinks: {},
        companySize: 'small',
        headquarterLocation: '',
        subsidiaries: [],
        certifications: []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCompanies.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch companies';
      })
      .addCase(getCompanyById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCompanyById.fulfilled, (state, action: PayloadAction<Company>) => {
        state.status = 'succeeded';
        state.company = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch company';
      })
      .addCase(createCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.status = 'succeeded';
        state.company = action.payload;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create company';
      })
      .addCase(updateCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.status = 'succeeded';
        state.company = action.payload;
        const index = state.companies.findIndex((company) => company._id === action.payload._id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update company';
      })
      .addCase(deleteCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCompany.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.companies = state.companies.filter((company) => company._id !== action.payload);
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete company';
      });
  }
});

export const { initNewCompany } = companySlice.actions;
export default companySlice.reducer;
