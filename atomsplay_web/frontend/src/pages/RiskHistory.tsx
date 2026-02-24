import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Calendar, MapPin, Activity } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface HistoryEntry {
  eventId: string;
  sport: string;
  city: string;
  date: string;
  riskScore: number;
  disruptionPercentage: number;
  injuryPercentage: number;
  performanceDrop: number;
  decisionTaken: string;
}

const mockHistory: HistoryEntry[] = [
  {
    eventId: 'EV-2024-001',
    sport: 'Cricket',
    city: 'Mumbai',
    date: '2024-01-15',
    riskScore: 75,
    disruptionPercentage: 45,
    injuryPercentage: 30,
    performanceDrop: 25,
    decisionTaken: 'Postponed',
  },
  {
    eventId: 'EV-2024-002',
    sport: 'Football',
    city: 'London',
    date: '2024-01-16',
    riskScore: 25,
    disruptionPercentage: 15,
    injuryPercentage: 10,
    performanceDrop: 8,
    decisionTaken: 'Proceeded',
  },
  {
    eventId: 'EV-2024-003',
    sport: 'Tennis',
    city: 'Melbourne',
    date: '2024-01-17',
    riskScore: 55,
    disruptionPercentage: 35,
    injuryPercentage: 25,
    performanceDrop: 20,
    decisionTaken: 'Modified Schedule',
  },
  {
    eventId: 'EV-2024-004',
    sport: 'Cricket',
    city: 'Dubai',
    date: '2024-01-18',
    riskScore: 85,
    disruptionPercentage: 60,
    injuryPercentage: 45,
    performanceDrop: 40,
    decisionTaken: 'Cancelled',
  },
  {
    eventId: 'EV-2024-005',
    sport: 'Football',
    city: 'Manchester',
    date: '2024-01-19',
    riskScore: 35,
    disruptionPercentage: 20,
    injuryPercentage: 15,
    performanceDrop: 12,
    decisionTaken: 'Proceeded',
  },
];

const RiskHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [entries] = useState(mockHistory);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.eventId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || entry.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-teal-400';
    if (score < 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-6 pb-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-lavender-400 to-teal-400 bg-clip-text text-transparent">
              Risk History
            </h1>
            <p className="text-gray-400 mt-1">View and analyze past risk assessments</p>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-lavender-500/20 text-lavender-400 rounded-lg hover:bg-lavender-500/30 transition-colors border border-lavender-500/30">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city or event ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-lavender-500"
              />
            </div>
            
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-lavender-500"
            >
              <option value="All">All Sports</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Tennis">Tennis</option>
            </select>
            
            <button className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <Filter className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Event ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Sport</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">City</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Risk Score</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Disruption %</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Injury %</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Performance Drop</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Decision</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <motion.tr
                    key={entry.eventId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-lavender-400">{entry.eventId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-gray-400" />
                        <span>{entry.sport}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{entry.city}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${getRiskColor(entry.riskScore)}`}>
                        {entry.riskScore}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{entry.disruptionPercentage}%</td>
                    <td className="py-4 px-6 text-gray-300">{entry.injuryPercentage}%</td>
                    <td className="py-4 px-6 text-gray-300">{entry.performanceDrop}%</td>
                    <td className="py-4 px-6">
                      <RiskBadge 
                        level={
                          entry.riskScore < 30 ? 'Low' : 
                          entry.riskScore < 60 ? 'Moderate' : 'High'
                        } 
                        size="sm" 
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {filteredEntries.length} of {entries.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-lavender-500/20 text-lavender-400 rounded-lg text-sm border border-lavender-500/30">
                1
              </button>
              <button className="px-3 py-1 bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                2
              </button>
              <button className="px-3 py-1 bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                3
              </button>
              <button className="px-3 py-1 bg-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHistory;