import React from 'react';

export const PMCalendar: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">December 2024</h2>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700 p-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({length: 35}, (_, i) => (
          <div key={i} className="border rounded-lg p-3 h-24 hover:bg-gray-50 cursor-pointer transition">
            <p className="text-sm font-semibold text-gray-700">{i % 30 + 1}</p>
            {i === 7 && <div className="text-xs bg-blue-100 text-blue-800 rounded px-1 mt-1 truncate">PM-001</div>}
            {i === 12 && <div className="text-xs bg-red-100 text-red-800 rounded px-1 mt-1 truncate">PM-002</div>}
            {i === 2 && <div className="text-xs bg-yellow-100 text-yellow-800 rounded px-1 mt-1 truncate">PM-003</div>}
          </div>
        ))}
      </div>
    </div>
  );
};