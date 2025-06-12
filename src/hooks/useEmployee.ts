/*
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeById } from '@/api/employees';
import { useNotification } from '@/contexts/NotificationContext';
import { Employee } from '@/types';

export const useEmployee = (id: string) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(id);
        setEmployee(data);
      } catch (error: unknown) {
        showNotification('Failed to load employee data', 'error');
        navigate('/employees');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchEmployee();
  }, [id, navigate, showNotification]);

  return { employee, isLoading };
};
*/
