import React, { useState } from 'react';
import { Button } from '@components/common';
import { PMList } from './PMList';
import { PMCalendar } from './PMCalendar';

export const PreventiveMaintenance: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Preventive Maintenance</h1>
      </div>

      <div className="mb-6 flex gap-2">
        <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>
          List View
        </Button>
        <Button variant={view === 'calendar' ? 'primary' : 'secondary'} onClick={() => setView('calendar')}>
          Calendar View
        </Button>
      </div>

      {view === 'list' ? <PMList /> : <PMCalendar />}
    </div>
  );
};