import React from 'react';
import RulesMobile from '../superAdmin/mobileVersion/Rules'; // Import the new file

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
    <div className="p-4 md:p-0">
      {/* MOBILE ONLY VIEW */}
      <div className="block md:hidden">
        <RulesMobile hoursTable={hoursTable} policies={policies} />
      </div>

      {/* DESKTOP ONLY VIEW (Your Original Style) */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold text-[#3D5A80] mb-6">RULES</h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Stewardship Program for GLC Scholarship</h2>
          <p className="text-gray-600 text-sm">
               The GLC Scholarship requires scholars to complete stewardship service hours as part of the college’s commitment to service,volunteerism, and community involvement. This requirement is necessary for scholarship retention and renewal.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 underline">Required Stewardship Hours</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        Counterpart and Required Hours
      </p>
             <div className="grid grid-cols-2 gap-3">
              {hoursTable.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded text-sm">
                  <span className="text-gray-700">{item.range}</span>
                  <span className="font-semibold text-gray-800">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}