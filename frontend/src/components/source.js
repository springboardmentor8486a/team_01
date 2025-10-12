export const mockIssues = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    status: 'in progress',
    priority: 'high',
    category: 'Road Maintenance',
    location: 'Main St & Oak Ave',
    reportedBy: 'John Citizen',
    date: '20/9/2024',
  },
  {
    id: 2,
    title: 'Broken Streetlight',
    status: 'resolved',
    priority: 'medium',
    category: 'Lighting',
    location: 'Pine Street',
    reportedBy: 'Jane Smith',
    date: '15/9/2024',
  },
  {
    id: 3,
    title: 'Overflowing Garbage Bin',
    status: 'pending',
    priority: 'medium',
    category: 'Waste Management',
    location: 'Central Park',
    reportedBy: 'Mike Johnson',
    date: '23/9/2024',
  },
  {
    id: 4,
    title: 'Graffiti on Public Building',
    status: 'in progress',
    priority: 'low',
    category: 'Vandalism',
    location: 'Community Center',
    reportedBy: 'Sarah Wilson',
    date: '18/9/2024',
  },
];

export const mockUsers = [
  // Add user data here if needed for the User Management tab
];

export const chartData = [
  { month: 'Jul', issues: 15, resolved: 12 },
  { month: 'Aug', issues: 22, resolved: 18 },
  { month: 'Sep', issues: 18, resolved: 15 },
];

export const categoryData = [
  { name: 'Road Maintenance', value: 35, color: '#2563eb' },
  { name: 'Lighting', value: 25, color: '#3b82f6' },
  { name: 'Waste Management', value: 20, color: '#60a5fa' },
  { name: 'Vandalism', value: 12, color: '#93c5fd' },
  { name: 'Other', value: 8, color: '#dbeafe' },
];