const { useState, useMemo, useEffect } = React;
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } = Recharts;

const App = () => {
  const [currentPage, setCurrentPage] = useState('teams');
  const [raceData, setRaceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load race data on mount
  useEffect(() => {
    fetch('./race_data.json')
      .then(res => res.json())
      .then(data => {
        // Handle null values in JSON
        const cleanData = data.map(row => ({
          ...row,
          Points: row.Points === null ? undefined : row.Points,
          LAP2: row.LAP2 === null ? undefined : row.LAP2,
          LAP3: row.LAP3 === null ? undefined : row.LAP3,
          LAP4: row.LAP4 === null ? undefined : row.LAP4,
          Penalty: row.Penalty === null ? undefined : row.Penalty,
          TotalSeconds: row.TotalSeconds === null ? undefined : row.TotalSeconds
        }));
        setRaceData(cleanData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading race data:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-700">Loading race data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🚵 Utah High School MTB Racing Analytics
          </h1>
          <p className="text-gray-600 mt-2">2025 Region 5 Racing Season</p>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage('teams')}
              className={`py-4 px-6 font-semibold transition-all ${
                currentPage === 'teams'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Team Comparison
            </button>
            <button
              onClick={() => setCurrentPage('riders')}
              className={`py-4 px-6 font-semibold transition-all ${
                currentPage === 'riders'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Individual Racers
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'teams' ? (
          <TeamComparisonPage data={raceData} />
        ) : (
          <IndividualRacersPage data={raceData} />
        )}
      </main>

      <footer className="bg-white mt-16 py-6 border-t-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>2025 Region 5 Racing Season | Data includes 4 races: Snowbasin, Manti, Beaver, Richfield</p>
        </div>
      </footer>
    </div>
  );
};

// ==================== TEAM COMPARISON PAGE ====================
const TeamComparisonPage = ({ data }) => {
  const [selectedTeams, setSelectedTeams] = useState(['Maple Mountain']);
  const [selectedRace, setSelectedRace] = useState('all');
  const [showNehoGoats, setShowNehoGoats] = useState(true);

  const nehoGoatsTeams = ['Maple Mountain', 'Salem Hills', 'Payson', 'Spanish Fork', 'Springville'];

  const teams = useMemo(() => {
    const teamCounts = {};
    data.forEach(entry => {
      teamCounts[entry.Team] = (teamCounts[entry.Team] || 0) + 1;
    });
    return Object.keys(teamCounts)
      .sort((a, b) => teamCounts[b] - teamCounts[a])
      .filter(team => teamCounts[team] > 20);
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedRace === 'all') return data;
    return data.filter(d => d.Race.includes(selectedRace));
  }, [data, selectedRace]);

  const toggleTeam = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter(t => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const toggleNehoGoats = () => {
    if (showNehoGoats) {
      setSelectedTeams(selectedTeams.filter(t => !nehoGoatsTeams.includes(t)));
      setShowNehoGoats(false);
    } else {
      setSelectedTeams([...new Set([...selectedTeams, ...nehoGoatsTeams])]);
      setShowNehoGoats(true);
    }
  };

  const teamMetrics = useMemo(() => {
    const metrics = {};

    selectedTeams.forEach(team => {
      const teamData = filteredData.filter(d => d.Team === team);
      
      const totalRacers = new Set(teamData.map(d => d.Name)).size;
      
      const genderCategories = teamData.map(d => d['Race Category']);
      const maleRaces = genderCategories.filter(cat => cat.includes('Boys')).length;
      const femaleRaces = genderCategories.filter(cat => cat.includes('Girls')).length;
      const genderBalance = femaleRaces / (maleRaces + femaleRaces) * 100;

      const top25Count = teamData.filter(d => {
        const placement = parseInt(d.Placement);
        const categoryData = filteredData.filter(dd => dd['Race Category'] === d['Race Category']);
        const totalInCategory = categoryData.length;
        const top25Threshold = Math.ceil(totalInCategory * 0.25);
        return placement <= top25Threshold;
      }).length;

      const podiumCount = teamData.filter(d => {
        const placement = parseInt(d.Placement);
        return placement >= 1 && placement <= 5;
      }).length;

      const gaps = teamData
        .filter(d => d.TotalSeconds && d.Placement !== '1')
        .map(d => {
          const categoryData = filteredData.filter(dd => 
            dd['Race Category'] === d['Race Category'] && dd.Race === d.Race
          );
          const winner = categoryData.find(dd => dd.Placement === '1');
          if (winner && winner.TotalSeconds) {
            return d.TotalSeconds - winner.TotalSeconds;
          }
          return null;
        })
        .filter(g => g !== null);
      
      const avgGapToWinner = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;

      const categoryDistribution = {};
      teamData.forEach(d => {
        const cat = d['Race Category'];
        categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      });

      metrics[team] = {
        totalRacers,
        genderBalance,
        top25Count,
        podiumCount,
        avgGapToWinner,
        categoryDistribution,
        totalRaces: teamData.length
      };
    });

    return metrics;
  }, [selectedTeams, filteredData]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Selection</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Race:</label>
          <select
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Races</option>
            <option value="Race 1">Race 1 - Snowbasin</option>
            <option value="Race 2">Race 2 - Manti</option>
            <option value="Race 3">Race 3 - Beaver</option>
            <option value="Race 4">Race 4 - Richfield</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            onClick={toggleNehoGoats}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showNehoGoats
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showNehoGoats ? '✓ Nebo Goats Teams' : 'Show Nebo Goats Teams'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {teams.map(team => (
            <button
              key={team}
              onClick={() => toggleTeam(team)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTeams.includes(team)
                  ? nehoGoatsTeams.includes(team)
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Racers"
          data={selectedTeams.map(team => ({
            team,
            value: teamMetrics[team]?.totalRacers || 0
          }))}
        />
        <MetricCard
          title="Podium Finishes (1st-5th)"
          data={selectedTeams.map(team => ({
            team,
            value: teamMetrics[team]?.podiumCount || 0
          }))}
        />
        <MetricCard
          title="Top 25% Finishers"
          data={selectedTeams.map(team => ({
            team,
            value: teamMetrics[team]?.top25Count || 0
          }))}
        />
        <MetricCard
          title="Avg Gap to Winner (sec)"
          data={selectedTeams.map(team => ({
            team,
            value: Math.round(teamMetrics[team]?.avgGapToWinner || 0)
          }))}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gender Balance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedTeams.map(team => ({
            team,
            female: teamMetrics[team]?.genderBalance || 0,
            male: 100 - (teamMetrics[team]?.genderBalance || 0)
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" angle={-45} textAnchor="end" height={100} />
            <YAxis label={{ value: '% of Racers', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="female" fill="#ec4899" name="Female %" />
            <Bar dataKey="male" fill="#3b82f6" name="Male %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CategoryFunnelChart selectedTeams={selectedTeams} teamMetrics={teamMetrics} />
    </div>
  );
};

const MetricCard = ({ title, data }) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.sort((a, b) => b.value - a.value).map((item, idx) => (
          <div key={item.team} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 truncate mr-2">{item.team}</span>
            <span
              className="px-3 py-1 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors[idx % colors.length] }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryFunnelChart = ({ selectedTeams, teamMetrics }) => {
  const funnelOrder = [
    'Beginner 7th Grade Boys',
    'Beginner 8th Grade Boys',
    'Beginner Girls',
    'Intermediate 7th Grade Boys',
    'Intermediate 8th Grade Boys',
    'Intermediate Girls',
    'Advanced Boys',
    'Advanced Girls',
    'SLR Boys',
    'SLR Girls',
    'Freshman C Boys',
    'Freshman B Boys',
    'Freshman A Boys',
    'JV E Boys',
    'JV D Boys',
    'JV C Boys',
    'JV C Girls',
    'JV B Boys',
    'JV B Girls',
    'JV A Boys',
    'JV A Girls',
    'Varsity Boys',
    'Varsity Girls'
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Program Development Funnel</h2>
      <p className="text-gray-600 mb-6">Rider distribution from beginner → advanced categories</p>
      
      <div className="space-y-4">
        {funnelOrder.map((category, idx) => {
          const categoryData = selectedTeams.map((team, teamIdx) => ({
            team,
            count: teamMetrics[team]?.categoryDistribution[category] || 0,
            color: colors[teamIdx % colors.length]
          }));

          const totalCount = categoryData.reduce((sum, d) => sum + d.count, 0);

          if (totalCount === 0) return null;

          return (
            <div key={category} className="relative">
              <div className="flex items-center mb-2">
                <span className="text-sm font-semibold text-gray-700 w-48">{category}</span>
                <span className="text-xs text-gray-500 ml-2">({totalCount} riders)</span>
              </div>
              <div className="flex h-8 rounded-lg overflow-hidden">
                {categoryData.map((d, i) => {
                  if (d.count === 0) return null;
                  const width = (d.count / totalCount) * 100;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center text-white text-xs font-bold transition-all hover:opacity-80"
                      style={{
                        width: `${width}%`,
                        backgroundColor: d.color
                      }}
                      title={`${d.team}: ${d.count} riders`}
                    >
                      {width > 10 && d.count}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {selectedTeams.map((team, idx) => (
          <div key={team} className="flex items-center">
            <div
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span className="text-sm font-medium text-gray-700">{team}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== INDIVIDUAL RACERS PAGE ====================
const IndividualRacersPage = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const riders = useMemo(() => {
    return [...new Set(data.map(d => d.Name))].sort();
  }, [data]);

  const categories = useMemo(() => {
    return [...new Set(data.map(d => d['Race Category']))].sort();
  }, [data]);

  const teams = useMemo(() => {
    const teamCounts = {};
    data.forEach(entry => {
      teamCounts[entry.Team] = (teamCounts[entry.Team] || 0) + 1;
    });
    return Object.keys(teamCounts)
      .sort()
      .filter(team => teamCounts[team] > 20);
  }, [data]);

  const filteredRiders = useMemo(() => {
    return riders.filter(rider => {
      const matchesSearch = rider.toLowerCase().includes(searchTerm.toLowerCase());
      const riderData = data.filter(d => d.Name === rider);
      const matchesCategory = selectedCategory === 'all' || riderData.some(d => d['Race Category'] === selectedCategory);
      const matchesTeam = selectedTeam === 'all' || riderData.some(d => d.Team === selectedTeam);
      return matchesSearch && matchesCategory && matchesTeam;
    });
  }, [riders, searchTerm, selectedCategory, selectedTeam, data]);

  const riderDetails = useMemo(() => {
    if (!selectedRider) return null;

    const riderData = data.filter(d => d.Name === selectedRider).sort((a, b) => a.RaceNum - b.RaceNum);
    
    return {
      name: selectedRider,
      team: riderData[0]?.Team,
      races: riderData.map(race => {
        const placement = parseInt(race.Placement);
        const categoryData = data.filter(d => 
          d['Race Category'] === race['Race Category'] && d.Race === race.Race
        );
        const totalInCategory = categoryData.length;
        const percentile = ((totalInCategory - placement + 1) / totalInCategory) * 100;
        
        const winner = categoryData.find(d => d.Placement === '1');
        const podiumThreshold = 5;
        const gapToPodium = placement > podiumThreshold 
          ? race.TotalSeconds - categoryData.find(d => d.Placement === '5')?.TotalSeconds
          : 0;

        return {
          race: race.Race,
          raceNum: race.RaceNum,
          category: race['Race Category'],
          placement,
          totalInCategory,
          percentile,
          time: race['Total Time'],
          totalSeconds: race.TotalSeconds,
          gapToWinner: winner ? race.TotalSeconds - winner.TotalSeconds : 0,
          gapToPodium,
          isPodium: placement <= 5,
          isTop25: placement <= Math.ceil(totalInCategory * 0.25)
        };
      })
    };
  }, [selectedRider, data]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Find a Racer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter rider name..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Team:</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Found {filteredRiders.length} riders</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
            {filteredRiders.map(rider => (
              <button
                key={rider}
                onClick={() => setSelectedRider(rider)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  selectedRider === rider
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rider}
              </button>
            ))}
          </div>
        </div>
      </div>

      {riderDetails && (
        <>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold">{riderDetails.name}</h2>
            <p className="text-xl mt-2">{riderDetails.team}</p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm opacity-90">Total Races</span>
                <p className="text-2xl font-bold">{riderDetails.races.length}</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm opacity-90">Podium Finishes</span>
                <p className="text-2xl font-bold">
                  {riderDetails.races.filter(r => r.isPodium).length}
                </p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm opacity-90">Top 25% Finishes</span>
                <p className="text-2xl font-bold">
                  {riderDetails.races.filter(r => r.isTop25).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Race Results</h3>
            <div className="space-y-4">
              {riderDetails.races.map((race, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{race.race}</h4>
                      <p className="text-sm text-gray-600">{race.category}</p>
                    </div>
                    <div className="text-right">
                      {race.isPodium && (
                        <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold mb-1">
                          🏆 PODIUM
                        </span>
                      )}
                      {!race.isPodium && race.isTop25 && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold mb-1">
                          ✓ TOP 25%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Placement</span>
                      <p className="text-lg font-bold text-gray-800">
                        {race.placement} / {race.totalInCategory}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Percentile</span>
                      <p className="text-lg font-bold text-gray-800">
                        {race.percentile.toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Time</span>
                      <p className="text-lg font-bold text-gray-800">{race.time}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Gap to Winner</span>
                      <p className="text-lg font-bold text-gray-800">
                        +{Math.floor(race.gapToWinner / 60)}:{(race.gapToWinner % 60).toFixed(0).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {riderDetails.races.length > 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={riderDetails.races}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="race" angle={-45} textAnchor="end" height={100} />
                  <YAxis
                    yAxisId="left"
                    label={{ value: 'Placement (lower is better)', angle: -90, position: 'insideLeft' }}
                    reversed
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'Percentile %', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="placement"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Placement"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="percentile"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Percentile"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
