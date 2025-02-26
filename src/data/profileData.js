// User profile data
export const userProfile = {
  id: 'u1',
  name: 'Emily Johnson',
  email: 'emily.johnson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
  memberSince: 'May 2022',
  plan: 'Premium Plan',
  location: 'San Francisco, CA',
};

// User's pets data
export const userPets = [
  {
    id: 'p1',
    name: 'Bella',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1561495376-dc9c7c5b8726?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
    microchipId: '985112345678903',
    adoptionDate: 'June 12, 2020',
    vaccinations: [
      {
        name: 'Rabies',
        date: 'January 15, 2023',
        nextDue: 'January 15, 2024',
      },
      {
        name: 'DHPP',
        date: 'February 10, 2023',
        nextDue: 'February 10, 2024',
      },
      {
        name: 'Bordetella',
        date: 'March 5, 2023',
        nextDue: 'September 5, 2023',
      },
    ],
  },
  {
    id: 'p2',
    name: 'Max',
    breed: 'German Shepherd',
    age: '2 years',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1589941013454-ec7d8f92b8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
    microchipId: '985187654321098',
    adoptionDate: 'April 3, 2021',
    vaccinations: [
      {
        name: 'Rabies',
        date: 'March 20, 2023',
        nextDue: 'March 20, 2024',
      },
      {
        name: 'DHPP',
        date: 'March 20, 2023',
        nextDue: 'March 20, 2024',
      },
      {
        name: 'Leptospirosis',
        date: 'April 15, 2023',
        nextDue: 'April 15, 2024',
      },
    ],
  },
  {
    id: 'p3',
    name: 'Luna',
    breed: 'Siamese Cat',
    age: '1 year',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1574144113084-b6f450cc5e0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
    microchipId: '985198765432109',
    adoptionDate: 'November 15, 2022',
    vaccinations: [
      {
        name: 'Rabies',
        date: 'December 10, 2022',
        nextDue: 'December 10, 2023',
      },
      {
        name: 'FVRCP',
        date: 'December 10, 2022',
        nextDue: 'December 10, 2023',
      },
      {
        name: 'FeLV',
        date: 'January 5, 2023',
        nextDue: 'January 5, 2024',
      },
    ],
  },
];

// Appointment history
export const appointments = [
  {
    id: 'a1',
    pet: 'Max',
    type: 'Vaccination',
    clinic: 'Happy Paws Center',
    date: '2023-04-15',
    time: '10:00 AM',
    status: 'Completed',
  },
  {
    id: 'a2',
    pet: 'Bella',
    type: 'Check-up',
    clinic: 'Fluffy Friends Hospital',
    date: '2023-08-15',
    time: '11:30 AM',
    status: 'Completed',
  },
  {
    id: 'a3',
    pet: 'Max',
    type: 'Grooming',
    clinic: 'Pet Care & Love',
    date: '2023-09-10',
    time: '2:00 PM',
    status: 'Completed',
  },
  {
    id: 'a4',
    pet: 'Max',
    type: 'Check-up',
    clinic: 'Happy Paws Center',
    date: '2024-01-15',
    time: '9:30 AM',
    status: 'Upcoming',
  },
];

// Activity history
export const activities = [
  {
    id: 'act1',
    type: 'appointment',
    title: 'Scheduled an appointment',
    description: 'Vaccination for Max',
    date: '2023-12-20',
    time: '2:35 PM',
  },
  {
    id: 'act2',
    type: 'order',
    title: 'Placed an order',
    description: 'Premium Dog Food (2kg)',
    date: '2023-12-15',
    time: '10:20 AM',
  },
  {
    id: 'act3',
    type: 'payment',
    title: 'Made a payment',
    description: 'Premium Care Subscription',
    date: '2023-12-01',
    time: '9:45 AM',
  },
  {
    id: 'act4',
    type: 'adoption',
    title: 'Adoption request',
    description: 'Requested to adopt a Labrador puppy',
    date: '2023-11-25',
    time: '4:15 PM',
  },
]; 