import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeById } from '@/api/employees';
import { Employee, EmployeeDTO, SalaryPayment } from '@/types';
import { notify } from '@/store/notificationService';
import { useQuery } from '@tanstack/react-query';
import { getSalaryPayments } from '@/api/salaries';

export const useSalaries = () => {
  return useQuery<SalaryPayment[]>({
    queryKey: ['salaries'],
    queryFn: getSalaryPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployee = (id?: string) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
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

export const toEmployeeDTO = (emp: Employee): EmployeeDTO => ({
  id: emp.id,
  username: emp.username,
  name: emp.name,
  email: emp.email,
  phoneNumber: emp.phoneNumber,
  department: emp.department.name,
  dateOfEmployment: emp.dateOfEmployment,
  password: '',
  status: emp.status,
});