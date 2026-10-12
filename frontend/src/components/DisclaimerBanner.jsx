import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

const DisclaimerBanner = ({ customText }) => {
  return (
    <div className="bg-[#fff9e6] border border-[#f3d99f] rounded-xl p-3.5 sm:p-4 text-xs text-[#73531b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#bc6c25] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#5c3e0d] block sm:inline mr-1">
            कृषि परामर्श सूचना / Advisory Note:
          </span>
          <span>
            {customText ||
              'कृषिजेन AI द्वारा दी गई जानकारी प्रारंभिक शैक्षिक मार्गदर्शन है। रासायनिक छिड़काव या गंभीर रोग की स्थिति में अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि विशेषज्ञ से पुष्टि अवश्य करें।'}
          </span>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 bg-[#fef3c7] text-[#92400e] px-2.5 py-1 rounded-lg border border-[#fde68a] font-medium text-[11px] whitespace-nowrap self-end sm:self-auto">
        <PhoneCall className="w-3 h-3 text-[#b45309]" />
        <span>किसान हेल्पलाइन: 1800-180-1551</span>
      </div>
    </div>
  );
};

export default DisclaimerBanner;

