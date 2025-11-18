import React, { useState } from 'react';
import { HKDGroup, BusinessSector } from '../../types';
import HKDWizard from '../hkd/HKDWizard';
import HKDGroup1Dashboard from '../hkd/HKDGroup1Dashboard';
import HKDGroup2Dashboard from '../hkd/HKDGroup2Dashboard';
import HKDGroup3Info from '../hkd/HKDGroup3Info';

const HKDModule: React.FC = () => {
    // Persist group and sector in localStorage
    const [group, setGroup] = useState<HKDGroup>(() => {
        const savedGroup = localStorage.getItem('hkd-group');
        return (savedGroup as HKDGroup) || HKDGroup.Undetermined;
    });
    const [sector, setSector] = useState<BusinessSector | null>(() => {
        const savedSector = localStorage.getItem('hkd-sector');
        return (savedSector as BusinessSector) || null;
    });

    const handleGroupAndSectorSelect = (selectedGroup: HKDGroup, selectedSector: BusinessSector) => {
        localStorage.setItem('hkd-group', selectedGroup);
        localStorage.setItem('hkd-sector', selectedSector);
        setGroup(selectedGroup);
        setSector(selectedSector);
    };

    const handleReset = () => {
        localStorage.removeItem('hkd-group');
        localStorage.removeItem('hkd-sector');
        setGroup(HKDGroup.Undetermined);
        setSector(null);
    };

    const renderContent = () => {
        // If we have a group but no sector (e.g., from old localStorage), force re-selection
        if (group !== HKDGroup.Undetermined && !sector) {
            return <HKDWizard onGroupSelect={handleGroupAndSectorSelect} />;
        }

        switch (group) {
            case HKDGroup.Group1:
                return <HKDGroup1Dashboard onReset={handleReset} />;
            case HKDGroup.Group2:
                // We can be sure sector is not null here due to the check above
                return <HKDGroup2Dashboard onReset={handleReset} sector={sector!} />;
            case HKDGroup.Group3:
                return <HKDGroup3Info onReset={handleReset} />;
            case HKDGroup.Undetermined:
            default:
                return <HKDWizard onGroupSelect={handleGroupAndSectorSelect} />;
        }
    };
    
    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default HKDModule;