// src/hooks/useEmployee.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeById, getOwnProfile } from '@/api/employees';
import { EmployeeDTO, EmployeeProfileDTO } from '@/types';
import { notify } from '@/store/notificationService';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '@/api/employees';

export const useEmployees = () => {
  return useQuery<EmployeeDTO[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmployee = (id?: string) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(Number(id));
        setEmployee(data);
      } catch (error: unknown) {
        notify('Failed to fetch employee details', 'error');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };

    void fetchEmployee();
  }, [id, navigate]);

  return { employee, loading };
};

export const useOwnProfile = () => {
  return useQuery<EmployeeProfileDTO>({
    queryKey: ['ownProfile'],
    queryFn: getOwnProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const toEmployeeDTO = (emp: EmployeeDTO): EmployeeDTO => ({
  id: emp.id,
  username: emp.username,
  name: emp.name,
  email: emp.email,
  phoneNumber: emp.phoneNumber,
  department: emp.department,
  dateOfEmployment: emp.dateOfEmployment,
  password: '',
  status: emp.status,
  profilePicturePath: emp.profilePicturePath,
  documentPath: emp.documentPath,
  createdAt: emp.createdAt,
  updatedAt: emp.updatedAt
});