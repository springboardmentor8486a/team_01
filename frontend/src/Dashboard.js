import React from "react";
import { FaClipboardList, FaClock, FaSpinner, FaCheckCircle, FaUsers, FaChartLine } from "react-icons/fa";

const stats = [
  { title: "Total Issues", value: 4, icon: <FaClipboardList size={24} /> },
  { title: "Pending", value: 1, icon: <FaClock size={24} /> },
  { title: "In Progress", value: 2, icon: <FaSpinner size={24} /> },
  { title: "Resolved", value: 1, icon: <FaCheckCircle size={24} /> },
  { title: "Active Users", value: 4, icon: <FaUsers size={24} /> },
  { title: "This Month", value: 18, icon: <FaChartLine size={24} /> },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">CS</div>
          <h1 className="text-lg font-semibold text-gray-800">CleanStreet</h1>
        </div>
        <nav className="flex gap-6 text-gray-600 font-medium">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600">Dashboard</a>
          <a href="#">Profile</a>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="text-center p-8 bg-white m-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">
          Hello, welcome to <span className="text-blue-600">Clean Street Admin!</span>
        </h2>
        <p className="text-gray-500 mt-2">
          Manage and track all civic issues across the community
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 px-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="shadow-sm rounded-2xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center">
            <div className="text-blue-600 mb-2">{stat.icon}</div>
            <h3 className="text-lg font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.title}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
