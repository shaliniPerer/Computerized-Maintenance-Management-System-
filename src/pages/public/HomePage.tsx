import React from 'react';
import { Wrench, Briefcase, Calendar, Bell } from 'lucide-react';
import { Button } from '@components/common';
import { Route } from '@utils/constants';

interface HomePageProps {
  onNavigate: (page: Route) => void;
}


export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wrench className="text-blue-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">MaintenancePro</span>
          </div>
          <Button onClick={() => onNavigate('login')}>Login</Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Maintenance Operations
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive work order management and preventive maintenance scheduling system 
            designed for enterprise facilities management
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => onNavigate('login')}>Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Briefcase className="text-blue-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Work Order Management</h3>
            <p className="text-gray-600">
              Create, track, and manage work orders with priority levels, status tracking, 
              and technician assignment
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Calendar className="text-green-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Preventive Maintenance</h3>
            <p className="text-gray-600">
              Schedule recurring maintenance tasks, set reminders, and ensure equipment 
              reliability with preventive care
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Bell className="text-orange-600 mb-4" size={48} />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Real-time Notifications</h3>
            <p className="text-gray-600">
              Stay informed with instant alerts for new work orders, status updates, 
              and upcoming maintenance schedules
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Maintenance Operations?
          </h2>
          <p className="text-gray-600 mb-6">
            Join hundreds of facilities using MaintenancePro for efficient operations
          </p>
          <Button size="lg" onClick={() => onNavigate('login')}>Start Free Trial</Button>
        </div>
      </div>
    </div>
  );
};