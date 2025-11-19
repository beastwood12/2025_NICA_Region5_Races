# Utah HS MTB Racing Analytics - Complete Project Documentation

## 📋 Project Summary
**Date Created**: November 19, 2025  
**Purpose**: Interactive web dashboard for analyzing Utah High School Mountain Bike racing data from 2025 Region 5 season  
**Focus**: Maple Mountain High School and Nebo Goats Composite Team analysis

---

## 📂 Project Files

### Core Application Files
1. **index.html** - Main HTML entry point
   - Loads React, Recharts, Tailwind CSS from CDNs
   - Minimal structure with root div
   - No build process required

2. **app.js** - Complete React application (26KB)
   - Two-page dashboard (Team Comparison + Individual Racers)
   - All metrics and visualizations
   - Uses React hooks (useState, useMemo, useEffect)

3. **race_data.json** - Complete dataset (1.4MB)
   - 3,916 race entries
   - 1,188 unique riders
   - 22 teams
   - 4 races (Snowbasin, Manti, Beaver, Richfield)

4. **README.md** - Deployment instructions

5. **PROJECT_DOCUMENTATION.md** - This comprehensive guide

---

## 🗂️ Data Structure

### CSV Source Files
Original files parsed and converted to JSON:
- `2025_Region5_Race1_SnowBasin.csv` (1,123 entries)
- `2025_Region5_Race2_Manti_Results.csv` (1,114 entries)
- `2025_Region5_Race3_Beaver_Results.csv` (1,059 entries)
- `2025_Region5_Race4_Richfield_Results.csv` (620 entries, HS only)

### JSON Data Schema
Each race entry contains:
```json
{
  "Year": 2025,
  "Region": 5,
  "Location": "SNOWBASIN",
  "Race Category": "Beginner Girls",
  "Placement": "1",
  "Plate#": 65072,
  "Name": "GRACE WILSON",
  "Team": "Lone Peak",
  "Points": null,
  "LAP1": "40:35",
  "LAP2": null,
  "LAP3": null,
  "LAP4": null,
  "Penalty": null,
  "Total Time": "40:35.01",
  "Race": "Race 1 - Snowbasin",
  "RaceNum": 1,
  "TotalSeconds": 2435.01
}
```

### Key Fields Explained
- **Race Category**: Category name (e.g., "Beginner Girls", "Varsity Boys")
- **Placement**: Finishing position in category (as string)
- **Total Time**: Finish time in MM:SS.FF or HH:MM:SS.FF format
- **TotalSeconds**: Converted time in seconds for calculations (added by parser)
- **Race**: Human-readable race name
- **RaceNum**: 1-4 for chronological ordering

---

## 📊 Race Categories (Ordered Beginner → Advanced)

### Junior Development (7th & 8th Grade) - Races 1-3 Only
1. Beginner 7th Grade Boys
2. Beginner 8th Grade Boys
3. Beginner Girls (combined 7th/8th)
4. Intermediate 7th Grade Boys
5. Intermediate 8th Grade Boys
6. Intermediate Girls (combined 7th/8th)
7. Advanced Boys (combined 7th/8th)
8. Advanced Girls (combined 7th/8th)

### High School (9th-12th Grade) - All Races
9. SLR Boys (Single Lap Rider - casual/beginner HS)
10. SLR Girls
11. Freshman C Boys
12. Freshman B Boys
13. Freshman A Boys
14. JV E Boys
15. JV D Boys
16. JV C Boys
17. JV C Girls
18. JV B Boys
19. JV B Girls
20. JV A Boys
21. JV A Girls
22. Varsity Boys
23. Varsity Girls

**Note**: Categories A/B/C/D/E represent ability levels (A = most competitive)

---

## 🎯 Dashboard Features

### Page 1: Team Comparison

#### Core Performance Metrics
1. **Total Racers**
   - Unique rider count per team
   - Calculated using: `new Set(teamData.map(d => d.Name)).size`

2. **Podium Finishes (1st-5th)**
   - Count of top 5 placements (medal positions)
   - Calculated: `placement >= 1 && placement <= 5`

3. **Top 25% Finishers**
   - Count of riders finishing in top quartile of their category
   - Calculated: `placement <= Math.ceil(totalInCategory * 0.25)`

4. **Average Gap to Winner**
   - Mean time difference from category winner (in seconds)
   - Only for non-winners with valid time data

#### Program Health Indicators
1. **Gender Balance Chart**
   - Percentage of male vs female participation
   - Bar chart visualization

2. **Program Development Funnel**
   - Horizontal stacked bars showing rider distribution across categories
   - Color-coded by team
   - Shows pipeline from beginner to advanced

#### Interactive Features
- Race filter (All Races / Individual Race)
- Team multi-select with color coding
- "Nebo Goats Teams" quick toggle
- Responsive grid layouts

### Page 2: Individual Racers

#### Search & Filter
- Text search by rider name
- Category dropdown filter
- Team dropdown filter
- Displays matching rider count

#### Performance Profile
For each rider's race:
- **Placement**: X / Y format (position out of total)
- **Percentile**: Calculated as `((total - placement + 1) / total) * 100`
- **Time**: Original finish time
- **Gap to Winner**: Time behind 1st place (MM:SS format)
- **Badges**: 
  - 🏆 PODIUM (top 5)
  - ✓ TOP 25% (top quartile)

#### Multi-Race Comparison
- Race-by-race result cards
- Summary stats: Total races, Podium finishes, Top 25% finishes
- Performance trend chart:
  - Placement over time (lower is better - Y-axis reversed)
  - Percentile over time (dual Y-axis)

---

## 🏔️ Nebo Goats Composite Team

The Nebo Goats is a composite team consisting of riders from:
1. **Maple Mountain** (183 entries, 58 unique riders)
2. **Salem Hills** (188 entries)
3. **Payson** (147 entries)
4. **Spanish Fork** (111 entries)
5. **Springville** (107 entries)

These teams are automatically highlighted in green when selected.

---

## 📈 Key Statistics

### Overall
- **Total Entries**: 3,916
- **Unique Riders**: 1,188
- **Teams**: 22
- **Categories**: 24

### Top 5 Teams by Participation
1. Skyridge: 812 entries
2. Lone Peak: 761 entries
3. Wasatch: 655 entries
4. Lehi: 522 entries
5. Salem Hills: 188 entries

### Maple Mountain Breakdown
- **Total entries**: 183
- **Unique riders**: 58
- **Rank**: 7th largest team in region
- **Race 1**: 53 riders
- **Race 2**: 54 riders
- **Race 3**: 41 riders
- **Race 4**: 35 riders (HS only)

---

## 🔧 Technical Implementation

### Technology Stack
- **Frontend**: React 18 (via CDN)
- **Visualization**: Recharts 2.5.0
- **Styling**: Tailwind CSS (via CDN)
- **Build**: None required - runs directly in browser

### Key React Patterns Used
1. **useState** - Component state management
2. **useMemo** - Performance optimization for expensive calculations
3. **useEffect** - Data loading on mount
4. **Conditional Rendering** - Page switching, rider details

### Calculations

#### Top 25% Threshold
```javascript
const categoryData = filteredData.filter(dd => 
  dd['Race Category'] === d['Race Category']
);
const totalInCategory = categoryData.length;
const top25Threshold = Math.ceil(totalInCategory * 0.25);
return placement <= top25Threshold;
```

#### Percentile Ranking
```javascript
const percentile = ((totalInCategory - placement + 1) / totalInCategory) * 100;
```

#### Gap to Winner
```javascript
const winner = categoryData.find(dd => dd.Placement === '1');
if (winner && winner.TotalSeconds) {
  return currentRider.TotalSeconds - winner.TotalSeconds;
}
```

#### Gender Balance
```javascript
const maleRaces = genderCategories.filter(cat => cat.includes('Boys')).length;
const femaleRaces = genderCategories.filter(cat => cat.includes('Girls')).length;
const genderBalance = femaleRaces / (maleRaces + femaleRaces) * 100;
```

---

## 🚀 Deployment Options

### Option 1: Netlify (Recommended for Beginners)
1. Go to netlify.com
2. Sign up for free account
3. Drag and drop all files (index.html, app.js, race_data.json)
4. Site deploys instantly
5. Get shareable URL: `randomname.netlify.app`

### Option 2: GitHub Pages (Best for Version Control)
1. Create GitHub account
2. Create new repository
3. Upload all files
4. Settings → Pages → Enable
5. URL: `username.github.io/repo-name`

### Option 3: Local Testing
```bash
# Navigate to directory with files
python -m http.server 8000

# Or with Node.js
npx http-server -p 8000

# Open browser to:
http://localhost:8000
```

---

## 🔄 How to Update Data

### Adding New Races
1. Export race results to CSV (same format as existing)
2. Convert CSV to JSON using Python parser
3. Append new race data to `race_data.json`
4. Ensure "Race" and "RaceNum" fields are updated
5. Re-upload to hosting platform

### Python Conversion Code
```python
import pandas as pd
import json

# Load CSV
race5 = pd.read_csv('2025_Region5_Race5_NewVenue.csv')

# Add race identifiers
race5['Race'] = 'Race 5 - NewVenue'
race5['RaceNum'] = 5

# Convert time to seconds
def time_to_seconds(time_str):
    if pd.isna(time_str) or time_str == '':
        return None
    try:
        parts = str(time_str).split(':')
        if len(parts) == 2:  # MM:SS.FF
            minutes, seconds = parts
            return float(minutes) * 60 + float(seconds)
        elif len(parts) == 3:  # HH:MM:SS.FF
            hours, minutes, seconds = parts
            return float(hours) * 3600 + float(minutes) * 60 + float(seconds)
        else:
            return float(time_str)
    except:
        return None

race5['TotalSeconds'] = race5['Total Time'].apply(time_to_seconds)

# Load existing data
with open('race_data.json', 'r') as f:
    existing_data = json.load(f)

# Append new race
new_data = race5.to_dict('records')
combined = existing_data + new_data

# Save
with open('race_data.json', 'w') as f:
    json.dump(combined, f)
```

---

## 🐛 Known Limitations

1. **Browser Storage**: All data loaded in memory (1.4MB)
   - Works fine for current dataset
   - May need optimization if dataset grows significantly (>10MB)

2. **Performance**: 
   - Initial load takes ~2-3 seconds
   - All calculations done client-side
   - Works well with current data size

3. **Data Validation**:
   - Assumes clean CSV input
   - DNF/DNS entries should have null TotalSeconds
   - Penalties should be in same format as lap times

4. **Mobile**:
   - Works but charts may be small on phones
   - Best viewed on tablet or desktop

---

## 🎨 Design Decisions

### Color Scheme
- **Nebo Goats Teams**: Green (#10b981)
- **Other Selected Teams**: Blue (#3b82f6)
- **Unselected**: Gray (#d1d5db)
- **Podium Badges**: Yellow (#fbbf24)
- **Top 25% Badges**: Green (#10b981)

### Metric Card Colors
Rotating palette:
1. Blue (#3b82f6)
2. Green (#10b981)
3. Orange (#f59e0b)
4. Red (#ef4444)
5. Purple (#8b5cf6)
6. Pink (#ec4899)

### Layout Philosophy
- **Clean & minimal**: Focus on data, not decoration
- **Cards**: Each metric group in white card with shadow
- **Progressive disclosure**: Show summary first, details on demand
- **Responsive**: Grid layouts adapt to screen size

---

## 💡 Future Enhancement Ideas

### Additional Metrics
1. **Lap consistency score** (if lap data complete)
2. **Category transition tracking** (rider progression over season)
3. **Team vs team head-to-head** in specific categories
4. **Course comparison** (how riders perform on different terrains)

### New Features
1. **Export to PDF/CSV** functionality
2. **Share specific rider profile** (unique URL)
3. **Season progression animation**
4. **Team ranking over time** chart
5. **Comparative scatter plots** (e.g., gender balance vs performance)

### Data Enhancements
1. **Course profiles**: Elevation gain, technical difficulty
2. **Weather data**: Conditions for each race
3. **Historical data**: Prior season comparisons
4. **School demographics**: Elevation, enrollment, SES indicators

---

## 📝 Prompt History Summary

### Initial Discussion
- Defined purpose: Coaching insights for Maple Mountain
- Established two-page structure: Team Comparison + Individual Racers
- Discussed HS MTB racing context (inclusive, non-cut sport)

### Metric Refinement
- Changed "Top X%" to "Top 25% finishers" (adaptive to category size)
- Changed "Podium" from top 3 to top 5 (medal positions)
- Decided on SLR category placement in funnel

### Data Processing
- Loaded 4 CSV files
- Converted to JSON with TotalSeconds field
- Identified all 24 race categories
- Confirmed Nebo Goats composite teams present

### Dashboard Implementation
- Built React application with two pages
- Implemented all requested metrics
- Created program development funnel
- Added performance trend charts

---

## 🔐 File Manifest

```
utah-hs-mtb-dashboard/
├── index.html                  (938 bytes)
├── app.js                      (26 KB)
├── race_data.json              (1.4 MB)
├── README.md                   (2.6 KB)
└── PROJECT_DOCUMENTATION.md    (This file)
```

---

## ⚙️ Rebuilding from Scratch

If you need to recreate this project in a new chat:

### Step 1: Provide Context
Share this documentation file and explain:
- Purpose: MTB racing analytics for coaching insights
- Focus: Maple Mountain and Nebo Goats teams
- Two-page dashboard: Team Comparison + Individual Racers

### Step 2: Upload Data Files
Provide the 4 original CSV files:
- 2025_Region5_Race1_SnowBasin.csv
- 2025_Region5_Race2_Manti_Results.csv
- 2025_Region5_Race3_Beaver_Results.csv
- 2025_Region5_Race4_Richfield_Results.csv

### Step 3: Specify Requirements
- **Metrics**: Total racers, podium (1-5), top 25%, avg gap, gender balance, funnel
- **Categories**: Use the funnel order from this doc
- **Nebo Goats**: Maple Mountain, Salem Hills, Payson, Spanish Fork, Springville
- **Tech**: React via CDN, Recharts, Tailwind (no build process)

### Step 4: Key Instructions
- Race 4 is HS only (no Jr Devo)
- SLR = Single Lap Rider
- Podium = top 5 (not top 3)
- Top 25% is category-relative
- Multi-race comparison chronologically ordered

---

## 📞 Support Information

### Common Issues

**Q: Dashboard shows "Loading race data..." forever**  
A: Check browser console for errors. Likely CORS issue - use local server.

**Q: Charts not showing**  
A: Ensure Recharts CDN loaded. Check browser console.

**Q: Rider names not searchable**  
A: Check that race_data.json is in same directory as index.html

**Q: Gender balance shows NaN%**  
A: Some teams may have all boys or all girls. This is expected.

**Q: Performance trend only shows one point**  
A: Rider only raced once. Trend requires 2+ races.

---

## 📊 Testing Checklist

Before deploying:
- [ ] All 4 files present in same directory
- [ ] index.html opens in browser
- [ ] Dashboard loads within 5 seconds
- [ ] Both page tabs switch correctly
- [ ] Team selection toggles work
- [ ] Nebo Goats button highlights 5 teams
- [ ] Race filter updates metrics
- [ ] Rider search returns results
- [ ] Individual rider details display
- [ ] Performance trend chart shows (for multi-race riders)
- [ ] Gender balance chart renders
- [ ] Program funnel shows categories

---

## 🎓 Learning Resources

If you want to modify the dashboard:

### React Basics
- [React Docs](https://react.dev) - Official React documentation
- Focus on: useState, useEffect, useMemo hooks

### Recharts
- [Recharts Docs](https://recharts.org) - Chart library documentation
- Look at: BarChart, LineChart examples

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com) - Utility-first CSS
- Search for specific classes you want to modify

---

## 📅 Version History

**v1.0** - November 19, 2025
- Initial release
- Team comparison page with 4 metrics + funnel
- Individual racer page with search and trends
- Support for 4 races across 24 categories
- Nebo Goats team highlighting

---

## 🙏 Acknowledgments

- **Utah High School Cycling League** for organizing races
- **Nebo Goats MTB Team** for inspiring this analysis
- **All coaches and riders** making HS MTB racing amazing

---

**Document End**

For questions or to recreate this project, reference this documentation along with the source files.
