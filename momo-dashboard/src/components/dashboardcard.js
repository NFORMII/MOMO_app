import React from 'react';

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
      {/* Icon (if provided) */}
      {icon && <div className="text-blue-600 text-3xl">{icon}</div>}

      {/* Title & Value */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
