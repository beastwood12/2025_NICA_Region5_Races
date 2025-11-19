# Utah High School MTB Racing Analytics Dashboard

## 📊 Project Overview
Interactive web dashboard for analyzing Utah High School Mountain Bike racing data from the 2025 Region 5 season.

**Features:**
- **Team Comparison Page**: Compare team performance, gender balance, and program development
- **Individual Racer Page**: Search racers, view detailed results, and track performance trends

## 📁 Files Included
- `index.html` - Main HTML file
- `app.js` - React application code
- `race_data.json` - Complete race data (3,916 entries from 4 races)
- `README.md` - This file

## 🚀 Deployment Instructions

### Option 1: GitHub Pages (Recommended)
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "main" branch as source
5. Your site will be live at: `https://yourusername.github.io/repo-name`

### Option 2: Netlify
1. Go to [netlify.com](https://www.netlify.com/)
2. Drag and drop all files into Netlify
3. Your site will be instantly deployed!

### Option 3: Local Testing
1. Open `index.html` in a web browser
2. If you see CORS errors, use a local server:
   ```bash
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

## 📈 Data Summary
- **Total Race Entries**: 3,916
- **Unique Riders**: 1,188
- **Teams**: 22
- **Races**:
  - Race 1: Snowbasin (1,123 entries)
  - Race 2: Manti (1,114 entries)
  - Race 3: Beaver (1,059 entries)
  - Race 4: Richfield (620 entries - HS only)

## 🏔️ Nebo Goats Composite Teams
- Maple Mountain
- Salem Hills
- Payson
- Spanish Fork
- Springville

## 🎯 Key Metrics
### Team Comparison
- Total racers
- Podium finishes (1st-5th place)
- Top 25% finishers
- Average gap to winner
- Gender balance
- Program development funnel

### Individual Racer
- Race-by-race results
- Percentile rankings
- Performance trends
- Podium and top 25% achievements

## 🛠️ Tech Stack
- React 18
- Recharts (for visualizations)
- Tailwind CSS (for styling)
- No build process required - runs directly in browser!

## 📝 Notes
- Jr Devo (7th/8th grade) riders only compete in Races 1-3
- Race 4 (Richfield) is a Regional prep race for HS only
- Podium = Top 5 finishers (medals awarded)
- SLR = Single Lap Rider (beginner/casual HS category)

## 🔧 Customization
To update data for new races:
1. Replace `race_data.json` with updated data
2. Ensure JSON format matches existing structure
3. Data should include: Year, Region, Location, Race Category, Placement, Name, Team, Total Time, etc.

## 📧 Contact
For questions or issues, reach out to your team coach!

---
**Built with ❤️ for Utah High School MTB Racing**
