import { useQuery } from '@tanstack/react-query';
import apiClient from '@/config/apiClient';
import { EmployeeProfileDTO } from '@/types';

export const useProfile = () => {
  return useQuery<EmployeeProfileDTO, Error>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/profile');
      return data;
    },
  });
};