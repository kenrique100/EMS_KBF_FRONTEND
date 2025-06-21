export interface Department {
  name: string;
  displayName: string;
}

export const departments: Department[] = [
  { name: 'ADMINISTRATION', displayName: 'Administration' },
  { name: 'FISHERY', displayName: 'Fishery' },
  { name: 'POULTRY', displayName: 'Poultry' },
  { name: 'RABBITRY', displayName: 'Rabbitry' },
  { name: 'CONSTRUCTION', displayName: 'Construction' },
  { name: 'CROPS', displayName: 'Crops' },
  { name: 'LIVESTOCK', displayName: 'Livestock' },
  { name: 'FARM_MANAGEMENT', displayName: 'Farm Management' }
];

export const getDepartmentDisplayName = (deptName: string): string => {
  const dept = departments.find(d => d.name === deptName);
  return dept ? dept.displayName : 'N/A';
};