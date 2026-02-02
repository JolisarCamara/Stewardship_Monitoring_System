import React from 'react';

const RulesMobile = ({ hoursTable, policies }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#3D5A80]">RULES</h1>
        <h2 className="text-lg font-bold text-gray-800 mt-4 leading-tight">
          Stewardship Program for <br/> GLC Scholarship
        </h2>
        <p className="text-gray-600 text-sm mt-3 leading-relaxed text-left md:text-justify">
  The GLC Scholarship requires scholars to complete stewardship service hours 
  as part of the college’s commitment to service, volunteerism, and community 
  involvement. This requirement is necessary for scholarship retention and renewal.
</p>
      </div>

      {/* Required Hours Section */}
      <div className="w-full">
        <h3 className="text-md font-bold text-gray-800 mb-3 border-b-2 border-[#C9A227] pb-1 inline-block">
          Required Stewardship Hours
        </h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Counterpart & Minimum Hours
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {hoursTable.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4">
                <span className="text-sm text-gray-700">{item.range}</span>
                <span className="text-sm font-bold text-[#3D5A80] bg-blue-50 px-3 py-1 rounded-full">
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2 italic px-1">
          * Fourth-year students with OJT/internship must complete at least half.
        </p>
      </div>

      {/* Key Policies Section */}
      <div className="mb-10">
        <h3 className="text-md font-bold text-gray-800 mb-4">Key Policies</h3>
        <div className="space-y-3">
          {policies.map((policy, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
              <span className="text-[#C9A227] font-bold">•</span>
              <p className="text-sm text-gray-600 leading-relaxed">{policy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RulesMobile;