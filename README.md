# Utah HS MTB Racing Analytics Dashboard

Interactive dashboard for analyzing 2025 Region 5 mountain bike racing results.

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload these files to your repository:
   - `index.html`
   - `race_data.json`
3. Go to Settings → Pages
4. Set Source to "main" branch, "/" (root) folder
5. Your dashboard will be live at: `https://yourusername.github.io/repo-name/`

### Option 2: Netlify

1. Create a new Netlify site
2. Drag and drop the folder containing:
   - `index.html`
   - `race_data.json`
3. Your dashboard will be live instantly!

### Option 3: Local Testing

1. Place `index.html` and `race_data.json` in the same folder
2. Open `index.html` in a web browser
3. **Note:** Some browsers may block local file loading. If you see "Failed to load data", use a local server:

```bash
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Or use Node.js http-server
npx http-server
```

Then visit `http://localhost:8000`

## 📊 Features

- **Searchable Rider Selection** - Find riders by name or team
- **Race-by-Race Comparison** - View all races side-by-side in a compact table
- **Performance Metrics** - Track total races, best placement, and podium finishes
- **Intelligent Race Analysis** - Get personalized coaching tips and encouragement
- **Lap Time Tracking** - See all lap times and total race times
- **Mobile Responsive** - Works great on all devices

## 📁 File Structure

```
your-repo/
├── index.html          # Main dashboard (single file, all code included)
└── race_data.json      # Race results data
```

## 🔧 Data Format

Your `race_data.json` should be an array of race entries with this structure:

```json
[
  {
    "Year": 2025,
    "Region": 5,
    "Location": "SNOWBASIN",
    "Race Category": "Beginner Girls",
    "Placement": "2",
    "Plate#": 65021,
    "Name": "RIDER NAME",
    "Team": "Team Name",
    "Points": null,
    "LAP1": "41:22",
    "LAP2": null,
    "LAP3": null,
    "LAP4": null,
    "Penalty": null,
    "Total Time": "41:22.50",
    "Race": "Race 1 - Snowbasin",
    "RaceNum": 1,
    "TotalSeconds": 2482.5
  }
]
```

## 🎯 Usage

1. Type a rider's name or team in the search box
2. Click a rider to view their performance
3. Scroll horizontally to compare races side-by-side
4. Read the race analysis for coaching insights

## 🛠 Updating Data

To update with new race results:
1. Replace `race_data.json` with your updated file
2. Commit and push to GitHub (or re-upload to Netlify)
3. Your dashboard updates automatically!

## 💡 Tips

- The dashboard loads all data client-side - no server required
- Works offline once the page is loaded (with cached data)
- Perfect for sharing with coaches, parents, and riders
- Search is instant and filters by both name and team

## 📱 Mobile Support

The dashboard is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

Horizontal scrolling is enabled for the race comparison table on smaller screens.

---

Built with React and Tailwind CSS • No build process required • Deploy anywhere!
