# StreetSacn

A comprehensive web application that combines citizen pothole reporting with employee management capabilities. This project unifies both user-side pothole reporting and employee-side management into a single cohesive system.

## 🎯 Features

### For Citizens
- **Report Potholes**: Capture photos, get GPS location, and submit reports with AI analysis
- **Interactive Map**: View all reported potholes with color-coded status markers
- **Leaderboard**: Compete with other citizens and earn points for reporting
- **My Reports**: Track the status of your submitted reports

### For Employees
- **Dashboard**: Overview of all reports with statistics
- **Report Management**: View, assign, and update report statuses
- **Real-time Updates**: See new reports as they come in
- **Statistics**: Track progress and workload

## 🚀 Key Technologies

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Leaflet** for interactive maps
- **Google Gemini AI** for image analysis (optional)
- **LocalStorage** for data persistence (no database required)

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn package manager
- Modern web browser with geolocation support

## 🛠️ Installation

1. **Clone or extract the project**
   ```bash
   cd unified-pothole-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key if you have one
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Accounts

The application comes with pre-configured demo accounts:

### Citizen Account
- **Email**: `citizen@demo.com`
- **Password**: Any password (demo mode)
- **Role**: Can report potholes, view maps, see leaderboard

### Employee Account  
- **Email**: `employee@demo.com`
- **Password**: Any password (demo mode)
- **Role**: Can manage reports, view dashboard, update statuses

## 🗺️ Usage Guide

### As a Citizen:
1. Log in with citizen credentials or create a new citizen account
2. Use the **Report** tab to:
   - Take/upload a photo of a pothole
   - Get your current location
   - Add optional notes
   - Submit for AI analysis
3. View all reports on the **Map** tab
4. Check your ranking on the **Leaderboard** tab
5. Track your submissions in **My Reports** tab

### As an Employee:
1. Log in with employee credentials or create a new employee account
2. View dashboard with summary statistics
3. Browse recent reports and their details
4. Click on reports to view more information
5. Update report statuses as work progresses

## 🤖 AI Features

The application integrates with Google Gemini AI for:
- **Image Analysis**: Automatically detect if submitted photos contain potholes
- **Severity Assessment**: Classify pothole severity (Low/Medium/High/Critical)
- **Repair Plans**: Generate AI-powered repair recommendations

**Note**: AI features work with a valid Gemini API key. Without an API key, the system uses intelligent mock responses that still provide a realistic experience.

## 💾 Data Storage

- **No Database Required**: All data is stored locally using browser localStorage
- **Mock Data**: Comes pre-loaded with sample reports for demonstration
- **Persistence**: Data persists between sessions
- **Reset Option**: Can clear data and reload samples if needed

## 🏗️ Project Structure

```
unified-pothole-app/
├── src/
│   ├── auth/                 # Authentication service & components
│   ├── components/
│   │   ├── citizen/         # Citizen-specific components
│   │   ├── employee/        # Employee-specific components
│   │   └── common/          # Shared components
│   ├── services/            # Data store, AI, location services
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app with role-based routing
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🚀 Building for Production

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

## 🎨 Customization

### Styling
- Modify Tailwind classes in components
- Dark theme is default but can be customized

### Data Structure
- Extend types in `src/types/index.ts`
- Modify data store in `src/services/dataStore.ts`

### AI Integration
- Configure Gemini settings in `src/services/geminiService.ts`
- Add your API key to enable real AI analysis

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 📱 Mobile Support

The application is fully responsive and includes:
- Touch-friendly interface
- Camera capture for mobile devices
- GPS location access
- Optimized layouts for small screens

## 🤝 Contributing

This is a unified system combining citizen reporting and employee management. When making changes:

1. Ensure both citizen and employee interfaces work correctly
2. Test authentication flow and role-based routing
3. Verify data consistency between interfaces
4. Test on both desktop and mobile devices

## 📄 License

This project is created for demonstration and educational purposes. Feel free to use it as a starting point for your own pothole management system.

## 🐛 Troubleshooting

### Common Issues:

1. **Map not loading**: Check internet connection and ensure Leaflet CSS is loaded
2. **Location not working**: Enable location services in your browser
3. **AI analysis failing**: Check if Gemini API key is configured correctly
4. **Build errors**: Ensure all dependencies are installed with `npm install`

### Browser Requirements:
- Modern browser with ES2020 support
- Geolocation API support
- LocalStorage enabled

## 🎯 Future Enhancements

Potential improvements for production use:
- Real database integration (PostgreSQL, MongoDB)
- User authentication with JWT tokens
- Email notifications for status updates
- Advanced analytics and reporting
- Mobile app version
- Integration with municipal systems
- Bulk import/export functionality

---

Built with ❤️ for safer roads everywhere!
