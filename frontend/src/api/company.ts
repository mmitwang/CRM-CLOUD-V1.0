import apiClient from './index';

interface Company {
  id: number;
  name: string;
  code: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CompanyCreate {
  name: string;
  code: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

interface CompanyUpdate {
  name?: string;
  code?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

export const companyApi = {
  // 获取公司列表
  getCompanies: (): Promise<Company[]> => {
    return apiClient.get('/api/v1/companies');
  },
  
  // 获取公司详情
  getCompany: (companyId: number): Promise<Company> => {
    return apiClient.get(`/api/v1/companies/${companyId}`);
  },
  
  // 创建公司
  createCompany: (company: CompanyCreate): Promise<Company> => {
    return apiClient.post('/api/v1/companies', company);
  },
  
  // 更新公司
  updateCompany: (companyId: number, company: CompanyUpdate): Promise<Company> => {
    return apiClient.put(`/api/v1/companies/${companyId}`, company);
  },
  
  // 删除公司
  deleteCompany: (companyId: number): Promise<any> => {
    return apiClient.delete(`/api/v1/companies/${companyId}`);
  },
};