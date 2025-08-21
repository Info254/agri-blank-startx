// Fix authorId property not existing in QualityControlDiscussion
export const discussions = [
  {
    id: 'd1',
    title: 'Best Practices for Quality Control in Maize Storage',
    description: 'A discussion on ensuring quality standards for maize in storage facilities across Kenya.',
    date: '2023-09-15',
    location: 'Nairobi County',
    organizer: 'Kenya Bureau of Standards',
    attendees: 45,
    tags: ['maize', 'storage', 'quality-standards', 'pest-control'],
    // Remove authorId since it's not in the interface
    authorName: 'John Mwangi',
    authorType: 'Quality Control Officer'
  },
  {
    id: 'd2',
    title: 'Organic Farming Techniques Workshop',
    description: 'A workshop focusing on sustainable organic farming methods to improve crop yield and soil health.',
    date: '2023-09-22',
    location: 'Nakuru County',
    organizer: 'Agricultural Society of Kenya',
    attendees: 60,
    tags: ['organic-farming', 'sustainable-agriculture', 'soil-health', 'crop-yield'],
    // Remove authorId since it's not in the interface
    authorName: 'Aisha Patel',
    authorType: 'Agronomist'
  },
  {
    id: 'd3',
    title: 'Post-Harvest Handling of Horticultural Crops',
    description: 'Training on best practices for handling horticultural crops after harvest to minimize losses and maintain quality.',
    date: '2023-10-01',
    location: 'Kiambu County',
    organizer: 'Horticultural Crops Directorate',
    attendees: 30,
    tags: ['post-harvest', 'horticulture', 'crop-handling', 'quality-control'],
    // Remove authorId since it's not in the interface
    authorName: 'Samuel Kimani',
    authorType: 'Agricultural Extension Officer'
  },
  {
    id: 'd4',
    title: 'Financial Literacy for Smallholder Farmers',
    description: 'A seminar aimed at improving the financial management skills of smallholder farmers.',
    date: '2023-10-10',
    location: 'Muranga County',
    organizer: 'Ministry of Agriculture',
    attendees: 50,
    tags: ['financial-literacy', 'smallholder-farmers', 'financial-management', 'agribusiness'],
    // Remove authorId since it's not in the interface
    authorName: 'Esther Njoroge',
    authorType: 'Financial Advisor'
  },
  {
    id: 'd5',
    title: 'Climate-Smart Agriculture Practices',
    description: 'A workshop on adopting climate-smart agricultural practices to build resilience to climate change.',
    date: '2023-10-18',
    location: 'Machakos County',
    organizer: 'Food and Agriculture Organization',
    attendees: 40,
    tags: ['climate-smart-agriculture', 'climate-change', 'resilience', 'sustainable-farming'],
    // Remove authorId since it's not in the interface
    authorName: 'David Omondi',
    authorType: 'Climate Change Expert'
  },
  {
    id: 'd6',
    title: 'Integrated Pest and Disease Management',
    description: 'Training on effective and environmentally friendly methods for managing pests and diseases in crops.',
    date: '2023-10-25',
    location: 'Kisumu County',
    organizer: 'Kenya Agricultural and Livestock Research Organization',
    attendees: 35,
    tags: ['pest-management', 'disease-control', 'integrated-farming', 'crop-protection'],
    // Remove authorId since it's not in the interface
    authorName: 'Grace Otieno',
    authorType: 'Plant Pathologist'
  },
  {
    id: 'd7',
    title: 'Water Management and Irrigation Techniques',
    description: 'A seminar on efficient water management and modern irrigation techniques for crop production.',
    date: '2023-11-02',
    location: 'Laikipia County',
    organizer: 'Water Resources Management Authority',
    attendees: 48,
    tags: ['water-management', 'irrigation', 'water-conservation', 'crop-production'],
    // Remove authorId since it's not in the interface
    authorName: 'Peter Kamau',
    authorType: 'Irrigation Engineer'
  },
  {
    id: 'd8',
    title: 'Value Addition and Agro-processing Opportunities',
    description: 'A workshop exploring opportunities for value addition and agro-processing to increase farmer incomes.',
    date: '2023-11-09',
    location: 'Uasin Gishu County',
    organizer: 'Kenya Industrial Research and Development Institute',
    attendees: 55,
    tags: ['value-addition', 'agro-processing', 'farmer-incomes', 'agri-business'],
    // Remove authorId since it's not in the interface
    authorName: 'Mercy Chebet',
    authorType: 'Agro-processing Specialist'
  }
];

export default discussions;
