const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const WorkOrder = require('../models/WorkOrder');
const PMSchedule = require('../models/PMSchedule');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany();
    await WorkOrder.deleteMany();
    await PMSchedule.deleteMany();
    console.log('Existing data cleared...');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@maintenance.com',
        password: 'admin123',
        role: 'Admin',
        phone: '+1-555-0001'
      },
      {
        name: 'John Tech',
        email: 'tech@maintenance.com',
        password: 'tech123',
        role: 'Technician',
        phone: '+1-555-0002'
      },
      {
        name: 'Staff Member',
        email: 'staff@maintenance.com',
        password: 'staff123',
        role: 'Staff',
        phone: '+1-555-0003'
      },
      {
        name: 'Mike Wilson',
        email: 'mike@maintenance.com',
        password: 'mike123',
        role: 'Technician',
        phone: '+1-555-0004'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@maintenance.com',
        password: 'sarah123',
        role: 'Technician',
        phone: '+1-555-0005'
      }
    ]);

    console.log('Users created...');

    // Create work orders
    const workOrders = await WorkOrder.create([
      {
        title: 'HVAC System Malfunction',
        description: 'AC unit not cooling properly in Building A',
        category: 'HVAC',
        priority: 'Emergency',
        status: 'In Progress',
        location: 'Building A - Floor 3',
        assignedTo: users[1]._id,
        assignedToName: users[1].name,
        createdBy: users[0]._id,
        activityLog: [{
          action: 'created',
          user: users[0]._id,
          userName: users[0].name,
          details: 'Work order created',
          timestamp: new Date()
        }]
      },
      {
        title: 'Electrical Panel Check',
        description: 'Routine electrical inspection needed',
        category: 'Electrical',
        priority: 'High',
        status: 'Open',
        location: 'Building B - Basement',
        assignedTo: users[3]._id,
        assignedToName: users[3].name,
        createdBy: users[0]._id,
        activityLog: [{
          action: 'created',
          user: users[0]._id,
          userName: users[0].name,
          details: 'Work order created',
          timestamp: new Date()
        }]
      },
      {
        title: 'Plumbing Leak Repair',
        description: 'Water leak in restroom needs immediate attention',
        category: 'Plumbing',
        priority: 'Medium',
        status: 'Completed',
        location: 'Building C - Floor 2',
        assignedTo: users[4]._id,
        assignedToName: users[4].name,
        createdBy: users[2]._id,
        completedAt: new Date(),
        activityLog: [{
          action: 'created',
          user: users[2]._id,
          userName: users[2].name,
          details: 'Work order created',
          timestamp: new Date()
        }]
      },
      {
        title: 'Fire Alarm Testing',
        description: 'Monthly fire alarm system test required',
        category: 'Fire Safety',
        priority: 'High',
        status: 'Open',
        location: 'Building A - All Floors',
        assignedTo: users[1]._id,
        assignedToName: users[1].name,
        createdBy: users[0]._id,
        activityLog: [{
          action: 'created',
          user: users[0]._id,
          userName: users[0].name,
          details: 'Work order created',
          timestamp: new Date()
        }]
      },
      {
        title: 'Lighting Fixture Replacement',
        description: 'Replace broken LED fixtures in hallway',
        category: 'Electrical',
        priority: 'Low',
        status: 'In Progress',
        location: 'Building D - Floor 1',
        assignedTo: users[3]._id,
        assignedToName: users[3].name,
        createdBy: users[0]._id,
        activityLog: [{
          action: 'created',
          user: users[0]._id,
          userName: users[0].name,
          details: 'Work order created',
          timestamp: new Date()
        }]
      }
    ]);

    console.log('Work orders created...');

    // Create PM schedules
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const pmSchedules = await PMSchedule.create([
      {
        title: 'HVAC Filter Replacement',
        description: 'Replace air filters in all HVAC units',
        asset: 'HVAC Unit A-301',
        frequency: 'Monthly',
        nextDueDate: nextWeek,
        assignedTo: users[1]._id,
        assignedToName: users[1].name,
        createdBy: users[0]._id,
        checklist: [
          { item: 'Inspect filters and replace if dirty', completed: false },
          { item: 'Check refrigerant levels', completed: false },
          { item: 'Test thermostat functionality', completed: false },
          { item: 'Clean condenser coils', completed: false },
          { item: 'Verify all electrical connections', completed: false }
        ]
      },
      {
        title: 'Generator Inspection',
        description: 'Quarterly inspection and maintenance of emergency generator',
        asset: 'Emergency Generator B1',
        frequency: 'Quarterly',
        nextDueDate: new Date(Date.now() - 86400000), // Yesterday (overdue)
        assignedTo: users[3]._id,
        assignedToName: users[3].name,
        createdBy: users[0]._id,
        status: 'Overdue',
        checklist: [
          { item: 'Check oil level and quality', completed: false },
          { item: 'Test battery and charging system', completed: false },
          { item: 'Run generator under load', completed: false },
          { item: 'Inspect fuel system', completed: false }
        ]
      },
      {
        title: 'Fire Extinguisher Check',
        description: 'Monthly inspection of all fire extinguishers',
        asset: 'All Fire Extinguishers',
        frequency: 'Monthly',
        nextDueDate: nextMonth,
        assignedTo: users[4]._id,
        assignedToName: users[4].name,
        createdBy: users[0]._id,
        checklist: [
          { item: 'Check pressure gauge', completed: false },
          { item: 'Inspect for damage', completed: false },
          { item: 'Verify accessibility', completed: false },
          { item: 'Update inspection tags', completed: false }
        ]
      },
      {
        title: 'Elevator Maintenance',
        description: 'Weekly elevator inspection and maintenance',
        asset: 'Elevator 1-3',
        frequency: 'Weekly',
        nextDueDate: nextWeek,
        assignedTo: users[1]._id,
        assignedToName: users[1].name,
        createdBy: users[0]._id,
        checklist: [
          { item: 'Test emergency systems', completed: false },
          { item: 'Lubricate moving parts', completed: false },
          { item: 'Check door sensors', completed: false },
          { item: 'Inspect cables and pulleys', completed: false }
        ]
      }
    ]);

    console.log('PM schedules created...');
    console.log(' Database seeded successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@maintenance.com / admin123');
    console.log('Technician: tech@maintenance.com / tech123');
    console.log('Staff: staff@maintenance.com / staff123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();