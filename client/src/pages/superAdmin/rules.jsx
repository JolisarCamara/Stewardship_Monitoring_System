import React from 'react';

const hoursTable = [
  { range: '0 - 499', hours: '80 Hours' },
  { range: '500 - 2,499', hours: '70 Hours' },
  { range: '2,500 - 4,999', hours: '60 Hours' },
  { range: '7,500 - 9,999', hours: '40 Hours' },
  { range: '10,000 - 12,499', hours: '30 Hours' },
  { range: '12,500 above', hours: '20 Hours' },
];

const policies = [
  'Required stewardship hours must be completed before the end of the semester for scholarship renewal.',
  'Stewardship hours must be verified and signed by the supervisor on the same day or within three (3) days.',
  'Summer stewardship is allowed with prior approval from SAO and the supervisor.',
  'More than 3 absences (without approved academic reasons) result in an additional ₱500 student payment per absence.',
  'More than 5 absences will lead to disqualification from the scholarship.',
  'Proper uniform is required (regular uniform or GLC Yellow shirt only).',
  'Break time and lunch are not counted as stewardship hours',
];

export default function Rules() {
  return (
    <div className="min-h-screen bg-[#E9EDF1] p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <h1 className="text-2xl font-bold text-[#3D5A80] mb-6">RULES</h1>

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Stewardship Program for GLC Scholarship
          </h2>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-5xl">
            The GLC Scholarship requires scholars to complete stewardship service hours as part of the college’s commitment to service, volunteerism, and community involvement. This requirement is necessary for scholarship retention and renewal.
          </p>
        </div>

        {/* Required Stewardship Hours Section */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-[#3D5A80] mb-4 underline decoration-gray-400 underline-offset-8">
            Required Stewardship Hours
          </h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-8">
            <p className="text-xs font-semibold text-gray-600 mb-5">
              Counterpart and Required Hours
            </p>
            
            {/* Hours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {hoursTable.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center bg-[#F1F4F9] px-5 py-2.5 rounded shadow-sm"
                >
                  <span className="text-xs text-gray-600 font-medium">{item.range}</span>
                  <span className="text-xs font-bold text-gray-800">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Policies Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4">
            Key Policies and Guidelines
          </h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
            <ul className="space-y-4">
              {policies.map((policy, index) => (
                <li key={index} className="flex items-start gap-4">
                  {/* Dot icon matching your screenshot */}
                  <span className="text-[#C9A227] mt-1 text-[10px] flex-shrink-0">•</span>
                  <span className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    {policy}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}