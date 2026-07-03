import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { useNotificationStore } from '../../store/index';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [families, setFamilies] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data);

      const familiesResponse = await adminService.getAllFamilies();
      setFamilies(familiesResponse.data.families);

      const submissionsResponse = await adminService.getAllSubmissions();
      setSubmissions(submissionsResponse.data.submissions);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">👨‍💼 Admin Dashboard</h1>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-semibold">Total Families</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalFamilies}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-semibold">Pending Reviews</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingReviews}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-semibold">Total Believe Value</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalBelieveValue}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 text-sm font-semibold">Avg per Family</p>
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(stats.averageBelieveValue)}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('families')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'families'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              👨‍👩‍👧‍👦 Families ({families.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'submissions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              📹 Submissions ({submissions.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && stats && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Game Progress</h3>
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{
                        width: `${(stats.approvedSubmissions / (stats.totalSubmissions || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {stats.approvedSubmissions} / {stats.totalSubmissions} submissions approved
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'families' && (
              <div className="space-y-4">
                {families.map((family) => (
                  <div
                    key={family._id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">{family.familyName}</h4>
                        <p className="text-gray-600 text-sm">
                          Leader: {family.userId?.name || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-500">
                          {family.believeValue}
                        </p>
                        <p className="text-gray-600 text-xs">Believe Points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {submission.familyId?.familyName}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Task: {submission.taskId?.title}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          submission.reviewStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : submission.reviewStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {submission.reviewStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
