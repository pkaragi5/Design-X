import { Github, Twitter, Linkedin, Globe } from 'lucide-react';

export const PROJECTS = [
  {
    id: 'p1',
    title: 'Nexus AI',
    description: 'A decentralized AI marketplace built on Ethereum and IPFS.',
    tech: ['React', 'Solidity', 'Tailwind'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: 'https://picsum.photos/seed/nexus/800/600'
  },
  {
    id: 'p2',
    title: 'EcoTrack',
    description: 'Real-time carbon footprint monitoring for smart cities.',
    tech: ['Next.js', 'Python', 'PostgreSQL'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: 'https://picsum.photos/seed/eco/800/600'
  },
  {
    id: 'p3',
    title: 'VibeCheck',
    description: 'Social sentiment analysis tool for brand reputation management.',
    tech: ['TypeScript', 'D3.js', 'Firebase'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: 'https://picsum.photos/seed/vibe/800/600'
  },
  {
    id: 'p4',
    title: 'Quantum Ledger',
    description: 'High-performance financial ledger with quantum-resistant encryption.',
    tech: ['Rust', 'WebAssembly', 'React'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: 'https://picsum.photos/seed/quantum/800/600'
  },
  {
    id: 'p5',
    title: 'Aura Health',
    description: 'Mental wellness platform using biometric data from wearables.',
    tech: ['React Native', 'Node.js', 'MongoDB'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: 'https://picsum.photos/seed/aura/800/600'
  },
  {
    id: 'p6',
    title: 'Skyline VR',
    description: 'Architectural visualization tool for immersive VR experiences.',
    tech: ['Three.js', 'React', 'WebXR'],
    github: 'https://github.com',
    live: 'https://example.com',
    image: 'https://picsum.photos/seed/skyline/800/600'
  }
];

export const TEAM = {
  leads: [
    {
      id: 't1',
      name: 'Alex Rivera',
      role: 'Club President',
      club: 'Tech',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      socials: { github: '#', twitter: '#', linkedin: '#' }
    },
    {
      id: 't2',
      name: 'Sarah Chen',
      role: 'Technical Lead',
      club: 'Tech',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      socials: { github: '#', twitter: '#', linkedin: '#' }
    }
  ],
  core: [
    {
      id: 't3',
      name: 'Marcus Thorne',
      role: 'Events Coordinator',
      club: 'Music',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      socials: { github: '#', twitter: '#', linkedin: '#' }
    },
    {
      id: 't4',
      name: 'Elena Vance',
      role: 'Design Lead',
      club: 'Drama',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      socials: { github: '#', twitter: '#', linkedin: '#' }
    },
    {
      id: 't5',
      name: 'Jordan Smith',
      role: 'Outreach Manager',
      club: 'Dance',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      socials: { github: '#', twitter: '#', linkedin: '#' }
    }
  ],
  members: [
    { id: 't6', name: 'David Kim', role: 'Fullstack Developer', club: 'Tech', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 't7', name: 'Lisa Wang', role: 'UI/UX Designer', club: 'Robotics', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
    { id: 't8', name: 'Chris Evans', role: 'Backend Engineer', club: 'Tech', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
    { id: 't9', name: 'Anna Bell', role: 'Data Scientist', club: 'Robotics', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' }
  ]
};

export const GALLERY_IMAGES = [
  { id: 'g1', url: 'https://picsum.photos/seed/event1/800/1200', title: 'Hackathon 2026', category: 'Events' },
  { id: 'g2', url: 'https://picsum.photos/seed/event2/1200/800', title: 'Workshop Session', category: 'Education' },
  { id: 'g3', url: 'https://picsum.photos/seed/event3/800/800', title: 'Team Building', category: 'Social' },
  { id: 'g4', url: 'https://picsum.photos/seed/event4/1000/1400', title: 'Project Showcase', category: 'Events' },
  { id: 'g5', url: 'https://picsum.photos/seed/event5/1400/1000', title: 'Annual Meetup', category: 'Social' },
  { id: 'g6', url: 'https://picsum.photos/seed/event6/800/1000', title: 'Coding Marathon', category: 'Events' },
  { id: 'g7', url: 'https://picsum.photos/seed/event7/1000/800', title: 'Design Sprint', category: 'Education' },
  { id: 'g8', url: 'https://picsum.photos/seed/event8/900/1300', title: 'Awards Ceremony', category: 'Social' }
];
