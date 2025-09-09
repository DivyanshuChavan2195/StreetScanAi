
import { Report, Status, DangerLevel, RoadType, Worker, WorkerStatus } from '../types';

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'worker-001',
    name: 'Alice',
    avatarUrl: 'https://picsum.photos/seed/worker1/100/100',
    status: WorkerStatus.Active,
    joinDate: '2022-08-15T09:00:00Z',
  },
  {
    id: 'worker-002',
    name: 'Bob',
    avatarUrl: 'https://picsum.photos/seed/worker2/100/100',
    status: WorkerStatus.Active,
    joinDate: '2021-05-20T09:00:00Z',
  },
  {
    id: 'worker-003',
    name: 'Charlie',
    avatarUrl: 'https://picsum.photos/seed/worker3/100/100',
    status: WorkerStatus.OnLeave,
    joinDate: '2023-01-10T09:00:00Z',
  },
  {
    id: 'worker-004',
    name: 'Diana',
    avatarUrl: 'https://picsum.photos/seed/worker4/100/100',
    status: WorkerStatus.Active,
    joinDate: '2022-11-01T09:00:00Z',
  },
    {
    id: 'worker-005',
    name: 'Edward',
    avatarUrl: 'https://picsum.photos/seed/worker5/100/100',
    status: WorkerStatus.Active,
    joinDate: '2023-03-22T09:00:00Z',
  },
];


export const MOCK_REPORTS: Report[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    location: { address: '123 Main St, Los Angeles', lat: 34.0522, lng: -118.2437 },
    timestamp: '2023-10-26T10:00:00Z',
    user: { id: 'user1', name: 'John Doe' },
    photoUrl: 'https://picsum.photos/seed/pothole1/800/600',
    description: 'Large pothole in the middle of the lane. Caused a flat tire.',
    upvotes: 15,
    dangerScore: 92.5,
    dangerLevel: DangerLevel.Critical,
    roadType: RoadType.Arterial,
    status: Status.Assigned,
    worker: 'Diana',
    activityLog: [
      { timestamp: '2023-10-26T10:30:00Z', message: 'Assigned to Diana.', type: 'assignment' },
      { timestamp: '2023-10-26T10:15:00Z', message: 'Status changed to Under Review.', type: 'status_change' },
      { timestamp: '2023-10-26T10:00:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    location: { address: '456 Oak Ave, Los Angeles', lat: 34.0600, lng: -118.2500 },
    timestamp: '2023-10-25T14:30:00Z',
    user: { id: 'user2', name: 'Jane Smith' },
    photoUrl: 'https://picsum.photos/seed/pothole2/800/600',
    description: 'Series of smaller potholes near the intersection.',
    upvotes: 5,
    dangerScore: 68.0,
    dangerLevel: DangerLevel.High,
    roadType: RoadType.Residential,
    status: Status.UnderReview,
    activityLog: [
      { timestamp: '2023-10-25T15:00:00Z', message: 'Status changed to Under Review.', type: 'status_change' },
      { timestamp: '2023-10-25T14:30:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    location: { address: '789 Pine Ln, Los Angeles', lat: 34.0450, lng: -118.2600 },
    timestamp: '2023-10-24T09:00:00Z',
    user: { id: 'user3', name: 'Sam Wilson' },
    photoUrl: 'https://picsum.photos/seed/pothole3/800/600',
    description: 'Pothole was fixed last month but has reappeared.',
    upvotes: 2,
    dangerScore: 45.2,
    dangerLevel: DangerLevel.Medium,
    roadType: RoadType.Residential,
    status: Status.Assigned,
    worker: 'Alice',
    activityLog: [
      { timestamp: '2023-10-24T10:00:00Z', message: 'Assigned to Alice.', type: 'assignment' },
      { timestamp: '2023-10-24T09:00:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    location: { address: '101 Freeway Ave, Los Angeles', lat: 34.0750, lng: -118.2800 },
    timestamp: '2023-10-23T18:00:00Z',
    user: { id: 'user4', name: 'Chris Evans' },
    photoUrl: 'https://picsum.photos/seed/pothole4/800/600',
    description: 'Crack across the freeway lane, very dangerous at high speed.',
    upvotes: 25,
    dangerScore: 98.1,
    dangerLevel: DangerLevel.Critical,
    roadType: RoadType.Highway,
    status: Status.UnderReview,
    activityLog: [
       { timestamp: '2023-10-23T18:05:00Z', message: 'Status changed to Under Review.', type: 'status_change' },
       { timestamp: '2023-10-23T18:00:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234',
    location: { address: '222 Maple Ct, Los Angeles', lat: 34.0300, lng: -118.2200 },
    timestamp: '2023-10-22T11:45:00Z',
    user: { id: 'user5', name: 'Brie Larson' },
    photoUrl: 'https://picsum.photos/seed/pothole5/800/600',
    description: 'Minor road damage, not a full pothole yet.',
    upvotes: 1,
    dangerScore: 21.7,
    dangerLevel: DangerLevel.Low,
    roadType: RoadType.Alley,
    status: Status.Fixed,
    worker: 'Alice',
    activityLog: [
       { timestamp: '2023-10-23T12:00:00Z', message: 'Status changed to Fixed.', type: 'status_change' },
       { timestamp: '2023-10-22T12:45:00Z', message: 'Assigned to Alice.', type: 'assignment' },
       { timestamp: '2023-10-22T11:45:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
    {
    id: 'f6a7b8c9-d0e1-2345-6789-0abcdef12345',
    location: { address: '555 Hollywood Blvd, Los Angeles', lat: 34.0983, lng: -118.3258 },
    timestamp: '2023-10-27T11:00:00Z',
    user: { id: 'user6', name: 'Tom H.' },
    photoUrl: 'https://picsum.photos/seed/pothole6/800/600',
    description: 'Deep pothole right in front of the theatre entrance. High foot traffic area.',
    upvotes: 32,
    dangerScore: 85.0,
    dangerLevel: DangerLevel.High,
    roadType: RoadType.Arterial,
    status: Status.Reported,
    activityLog: [
      { timestamp: '2023-10-27T11:00:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'g7b8c9d0-e1f2-3456-7890-bcdef1234567',
    location: { address: '876 Beachwood Dr, Los Angeles', lat: 34.0888, lng: -118.3111 },
    timestamp: '2023-10-26T16:20:00Z',
    user: { id: 'user7', name: 'Scarlett J.' },
    photoUrl: 'https://picsum.photos/seed/pothole7/800/600',
    description: 'Road surface is crumbling away on the shoulder.',
    upvotes: 3,
    dangerScore: 33.3,
    dangerLevel: DangerLevel.Low,
    roadType: RoadType.Residential,
    status: Status.Rejected,
    activityLog: [
       { timestamp: '2023-10-27T09:00:00Z', message: 'Status changed to Rejected.', type: 'status_change' },
       { timestamp: '2023-10-26T16:20:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
   {
    id: 'h8c9d0e1-f2a3-4567-8901-cdef12345678',
    location: { address: '999 Sunset Strip, Los Angeles', lat: 34.0901, lng: -118.3887 },
    timestamp: '2023-10-28T09:15:00Z',
    user: { id: 'user8', name: 'Mark R.' },
    photoUrl: 'https://picsum.photos/seed/pothole8/800/600',
    description: 'Multiple potholes causing traffic to swerve. Very busy road.',
    upvotes: 40,
    dangerScore: 95.0,
    dangerLevel: DangerLevel.Critical,
    roadType: RoadType.Arterial,
    status: Status.Reported,
    activityLog: [
      { timestamp: '2023-10-28T09:15:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'i9d0e1f2-a3b4-5678-9012-def123456789',
    location: { address: '1212 Rodeo Dr, Beverly Hills', lat: 34.0694, lng: -118.4039 },
    timestamp: '2023-10-28T12:00:00Z',
    user: { id: 'user9', name: 'Gwyneth P.' },
    photoUrl: 'https://picsum.photos/seed/pothole9/800/600',
    description: 'A small but sharp-edged pothole. Damaged my rim.',
    upvotes: 12,
    dangerScore: 72.5,
    dangerLevel: DangerLevel.High,
    roadType: RoadType.Arterial,
    status: Status.Assigned,
    worker: 'Edward',
    activityLog: [
        { timestamp: '2023-10-28T13:00:00Z', message: 'Assigned to Edward.', type: 'assignment' },
        { timestamp: '2023-10-28T12:00:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'j0e1f2a3-b4c5-6789-0123-ef1234567890',
    location: { address: '345 Santa Monica Pier, Santa Monica', lat: 34.0086, lng: -118.4973 },
    timestamp: '2023-10-27T19:45:00Z',
    user: { id: 'user10', name: 'Robert D. Jr.' },
    photoUrl: 'https://picsum.photos/seed/pothole10/800/600',
    description: 'Water-filled pothole, can\'t tell how deep it is.',
    upvotes: 8,
    dangerScore: 55.0,
    dangerLevel: DangerLevel.Medium,
    roadType: RoadType.Residential,
    status: Status.Fixed,
    worker: 'Bob',
    activityLog: [
       { timestamp: '2023-10-28T15:00:00Z', message: 'Status changed to Fixed.', type: 'status_change' },
       { timestamp: '2023-10-27T20:00:00Z', message: 'Assigned to Bob.', type: 'assignment' },
       { timestamp: '2023-10-27T19:45:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
    {
    id: 'k1f2a3b4-c5d6-7890-1234-f12345678901',
    location: { address: '700 Vine St, Los Angeles', lat: 34.0902, lng: -118.3278 },
    timestamp: '2023-10-29T08:00:00Z',
    user: { id: 'user11', 'name': 'Jeremy R.' },
    photoUrl: 'https://picsum.photos/seed/pothole11/800/600',
    description: 'Pothole near a busy crosswalk.',
    upvotes: 18,
    dangerScore: 75.0,
    dangerLevel: DangerLevel.High,
    status: Status.Fixed,
    roadType: RoadType.Arterial,
    worker: 'Bob',
    activityLog: [
      { timestamp: '2023-10-29T14:00:00Z', message: 'Status changed to Fixed.', type: 'status_change' },
      { timestamp: '2023-10-29T09:00:00Z', message: 'Assigned to Bob.', type: 'assignment' },
      { timestamp: '2023-10-29T08:00:00Z', message: 'New report created.', type: 'creation' },
    ]
  },
  {
    id: 'l2a3b4c5-d6e7-8901-2345-123456789012',
    location: { address: '800 Grand Ave, Los Angeles', lat: 34.0438, lng: -118.2558 },
    timestamp: '2023-10-29T10:30:00Z',
    user: { id: 'user12', 'name': 'Zoe S.' },
    photoUrl: 'https://picsum.photos/seed/pothole12/800/600',
    description: 'Minor crack, probably not urgent but good to log.',
    upvotes: 2,
    dangerScore: 15.0,
    dangerLevel: DangerLevel.Low,
    status: Status.Fixed,
    roadType: RoadType.Residential,
    worker: 'Alice',
    activityLog: [
      { timestamp: '2023-10-29T13:00:00Z', message: 'Status changed to Fixed.', type: 'status_change' },
      { timestamp: '2023-10-29T11:00:00Z', message: 'Assigned to Alice.', type: 'assignment' },
      { timestamp: '2023-10-29T10:30:00Z', message: 'New report created.', type: 'creation' },
    ]
  }
];
