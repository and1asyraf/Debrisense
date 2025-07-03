# DebriSense - Environmental Intelligence Dashboard

## 🌍 Overview

DebriSense is an AI-powered web dashboard designed to detect, predict, and visualize plastic pollution hotspots across Malaysia's rivers and coastlines. It integrates geospatial data, machine learning predictions, and environmental records into an interactive dashboard that informs decision-making for environmental stakeholders.

**Project:** Challenge 2 - Marine Pollution Detection & Response Using Big Data

## 🎯 Features

### Core Functionality
- **Interactive Risk Heatmap** - Visualize pollution risk zones across Malaysia
- **ML-Powered Predictions** - Seasonal risk forecasting using machine learning
- **Cleanup Event Tracking** - Manage and analyze cleanup activities
- **Data Export Tools** - Export insights and reports in multiple formats
- **NGO Planning Tools** - Generate targeted cleanup plans and risk assessments

### Key Pages
- **Dashboard** (`/dashboard`) - Main heatmap with interactive regions
- **Insights** (`/insights`) - ML predictions and trend analysis
- **Reports** (`/reports`) - Cleanup event management
- **Tools** (`/tools`) - NGO planning and export tools

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **UI Framework:** Bootstrap 5
- **Charts:** Chart.js
- **Maps:** Leaflet.js
- **Icons:** Font Awesome
- **Fonts:** Inter (Google Fonts)

## 📁 Project Structure

```
frontend/
├── index.html              # Landing page with auto-redirect
├── dashboard.html          # Main heatmap dashboard
├── insights.html           # ML insights and charts
├── reports.html            # Cleanup reports management
├── tools.html              # NGO tools and exports
├── notfound.html           # 404 error page
├── css/
│   └── styles.css          # Custom design system
├── js/
│   ├── main.js             # Core functionality
│   ├── filters.js          # Filter management
│   ├── dashboard.js        # Map and dashboard logic
│   ├── insights.js         # Charts and ML visualization
│   ├── reports.js          # Reports management
│   └── tools.js            # NGO tools functionality
├── data/
│   └── mock-data.js        # Mock data structure
└── components/
    ├── navbar.html         # Shared navigation
    ├── sidebar.html        # Filter sidebar
    └── footer.html         # Shared footer
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation
1. Clone or download the project
2. Navigate to the `frontend/` directory
3. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
4. Open your browser and navigate to `http://localhost:8000`

### Development
- All files are static HTML/CSS/JS
- No build process required
- Edit files directly and refresh browser to see changes
- Use browser developer tools for debugging

## 🎨 Design System

### Color Palette
- **Primary Green:** `#2E7D32` (Forest Green)
- **Secondary Green:** `#81C784` (Light Green)
- **Accent Amber:** `#FFC107` (Amber)
- **Risk Colors:**
  - Low: `#A5D6A7` (Soft Green)
  - Moderate: `#FFF176` (Soft Yellow)
  - High: `#EF5350` (Red)

### Typography
- **Font Family:** Inter, Roboto, Open Sans, sans-serif
- **Headings:** 20-24px, bold
- **Body:** 14-16px, normal
- **Labels:** 12-14px

## 📊 Data Structure

### Mock Data Entities
- **CleanupReport** - Beach/river cleanup event data
- **PollutionObservation** - Field observation reports
- **ML_PredictionZone** - Risk prediction zones
- **RiskInsightSummary** - Regional risk analytics

### Filter System
- **Season:** Northeast/Southwest Monsoon
- **State:** Malaysian states
- **River:** Major river systems
- **Pollution Type:** Plastic categories

## 🔧 Key Features

### Interactive Map
- Leaflet.js-based heatmap
- Clickable regions with detailed information
- Risk score visualization
- Filter-responsive overlays

### Charts & Analytics
- Risk trend line charts
- Pollution type distribution
- Regional comparison tables
- Seasonal analysis

### Data Management
- Add new cleanup reports
- Export data in multiple formats
- Search and filter functionality
- Real-time statistics

### NGO Tools
- Cleanup planning generator
- Risk assessment tool
- Report generation
- Data export utilities

## 🎯 User Stories

### Government Environmental Officer
- Identify high-risk rivers for next monsoon season
- Download risk reports for planning documents
- Compare seasonal predictions

### NGO Cleanup Coordinator
- Submit cleanup event data
- Generate targeted cleanup plans
- Export reports for stakeholders

### Data Scientist
- Compare historical vs. predicted data
- Analyze model accuracy
- Export data for further analysis

## 🔮 Future Enhancements

### Backend Integration
- Replace mock data with real API calls
- Implement user authentication
- Add real-time data updates

### Advanced Features
- Real-time sensor data integration
- Mobile-responsive design
- Advanced ML model integration
- Real-time notifications

### Data Sources
- Satellite imagery integration
- IoT sensor networks
- Social media monitoring
- Government databases

## 📝 Development Notes

### TODO Items
- [ ] Replace mock data with real API endpoints
- [ ] Implement real Leaflet.js map with GeoJSON
- [ ] Add real-time data updates
- [ ] Implement user authentication
- [ ] Add mobile responsiveness
- [ ] Integrate real ML model predictions

### Code Comments
- Use `// TODO: Replace with real API call` for backend integration points
- Use `<!-- TODO: Dynamic data hook here -->` for dynamic content areas
- All mock data is clearly marked for easy replacement

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established design system
3. Add appropriate TODO comments for backend integration
4. Test functionality across different browsers
5. Ensure accessibility compliance

## 📄 License

This project is developed for Challenge 2: Marine Pollution Detection & Response Using Big Data.

## 🌟 Acknowledgments

- **Design Inspiration:** Environmental dashboard best practices
- **Data Sources:** Mock data based on real environmental patterns
- **Icons:** Font Awesome
- **Maps:** OpenStreetMap via Leaflet.js
- **Charts:** Chart.js library

---

**Vision:** "Smarter Predictions, Cleaner Coasts."

DebriSense empowers stakeholders with the data they need to take early, focused action — helping Malaysia protect marine ecosystems from the plastic crisis using big data and AI. 