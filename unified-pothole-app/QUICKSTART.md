# Quick Start Guide

## Running the Application

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:3000`

3. **Test Login**:
   - **Citizen Demo**: `citizen@demo.com` (any password)
   - **Employee Demo**: `employee@demo.com` (any password)

## Testing the Integration

### As a Citizen:
1. Log in with citizen credentials
2. Click "📸 Report" tab
3. Upload any image file
4. Click "📍 Get Current Location" (allow location access)
5. Add optional notes
6. Submit the report (AI analysis will run)
7. Switch to "🗺️ Map" tab to see your report
8. Check "🏆 Leaderboard" to see your updated score
9. View "📜 My Reports" to see your submission details

### As an Employee:
1. Log out and log in with employee credentials
2. View the dashboard with report statistics
3. See all reports including the one you just submitted as a citizen
4. Click on reports to view details

### Data Sharing:
- Reports submitted by citizens appear immediately in the employee dashboard
- All data is shared between both interfaces
- Data persists in localStorage between sessions

## Key Features Verified:

✅ **Unified Authentication**: Single login system with role-based routing  
✅ **Shared Data Store**: Reports are instantly visible to both interfaces  
✅ **Citizen Submission**: Photo upload, AI analysis, location capture  
✅ **Employee Management**: View and manage all reports with statistics  
✅ **Real-time Updates**: Changes reflect across both sides  
✅ **Responsive Design**: Works on desktop and mobile  
✅ **AI Integration**: Mock analysis works without API key  

## Production Deployment

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static hosting service (Netlify, Vercel, etc.)
