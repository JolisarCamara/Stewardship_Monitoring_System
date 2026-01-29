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
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#3D5A80] mb-6">RULES</h1>

      {/* Program Title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Stewardship Program for GLC Scholarship
        </h2>
        <p className="text-gray-600 text-sm">
          The GLC Scholarship requires scholars to complete stewardship service hours as part of the college's 
          commitment to service, volunteerism, and community involvement. This requirement is necessary for 
          scholarship retention and renewal.
        </p>
      </div>

      {/* Required Hours Section */}
     <div className="flex justify-center mt-8">
  <div className="w-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-3 underline">
      Required Stewardship Hours
    </h3>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        School Fee Contribution and Minimum Required Hours
      </p>

      {/* TABLE */}
      <div className="grid grid-cols-2 gap-3">
        {hoursTable.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded text-sm"
          >
            <span className="text-gray-700">{item.range}</span>
            <span className="font-semibold text-gray-800">{item.hours}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Fourth-year students with OJT/internship must complete at least half of the required hours.
      </p>
    </div>
  </div>
</div>


      {/* Key Policies Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Key Policies and Guidelines</h3>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <ul className="space-y-3">
            {policies.map((policy, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-600">
                <span className="text-[#C9A227] mt-1">•</span>
                <span>{policy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}