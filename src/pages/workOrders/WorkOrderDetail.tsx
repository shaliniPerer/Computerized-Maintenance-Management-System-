import React, { useState, useEffect } from 'react';
import { Paperclip, Download } from 'lucide-react';
import { Button, Badge, Alert } from '@components/common';
import { workOrderService } from 'services';
import { WorkOrder } from '@models/workOrder.types';
import { formatRelativeTime, getPriorityColor, getStatusColor } from '@utils/helpers';

// Rest of the component remains the same
interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onBack: () => void;
}

export const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ workOrder: initialWO, onBack }) => {
  const [currentWO, setCurrentWO] = useState(initialWO);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    fetchWorkOrder();
  }, []);

  const fetchWorkOrder = async () => {
    try {
      const response = await workOrderService.getById(currentWO._id);
      if (response.success) {
        setCurrentWO(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch work order:', error);
    }
  };

  const handleStatusChange = async (newStatus: WorkOrder['status']) => {
    setIsUpdating(true);
    try {
      const response = await workOrderService.updateStatus(currentWO._id, newStatus);
      if (response.success) {
        setCurrentWO(response.data);
        setAlert({ message: `Status updated to ${newStatus}`, type: 'success' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error: any) {
      setAlert({ 
        message: error.response?.data?.message || 'Failed to update status', 
        type: 'error' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const response = await workOrderService.addNote(currentWO._id, noteText);
      if (response.success) {
        setCurrentWO(response.data);
        setNoteText('');
        setAlert({ message: 'Note added successfully', type: 'success' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error: any) {
      setAlert({ 
        message: error.response?.data?.message || 'Failed to add note', 
        type: 'error' 
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await workOrderService.uploadAttachment(currentWO._id, selectedFile);
      if (response.success) {
        setCurrentWO(response.data);
        setSelectedFile(null);
        setAlert({ message: 'File uploaded successfully', type: 'success' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (error: any) {
      setAlert({ 
        message: error.response?.data?.message || 'Failed to upload file', 
        type: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline flex items-center gap-2"
      >
        ← Back to Work Orders
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentWO.title}</h1>
            <p className="text-gray-600">{currentWO.workOrderId}</p>
          </div>
          <div className="flex gap-2">
            <Badge color={getPriorityColor(currentWO.priority)}>{currentWO.priority}</Badge>
            <Badge color={getStatusColor(currentWO.status)}>{currentWO.status}</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Work Order Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Category:</strong> {currentWO.category}</p>
              <p><strong>Location:</strong> {currentWO.location}</p>
              <p><strong>Assigned To:</strong> {currentWO.assignedTo?.name || 'Unassigned'}</p>
              <p><strong>Created:</strong> {new Date(currentWO.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{currentWO.description}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Status Progression</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant={currentWO.status === 'Open' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('Open')}
              disabled={isUpdating}
            >
              Open
            </Button>
            <span className="text-gray-400">→</span>
            <Button 
              variant={currentWO.status === 'In Progress' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('In Progress')}
              disabled={isUpdating}
            >
              In Progress
            </Button>
            <span className="text-gray-400">→</span>
            <Button 
              variant={currentWO.status === 'Completed' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('Completed')}
              disabled={isUpdating}
            >
              Completed
            </Button>
            <span className="text-gray-400">→</span>
            <Button 
              variant={currentWO.status === 'Verified' ? 'primary' : 'secondary'} 
              size="sm"
              onClick={() => handleStatusChange('Verified')}
              disabled={isUpdating}
            >
              Verified
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Technician Notes</h3>
          <div className="space-y-3 mb-4">
            {currentWO.notes && currentWO.notes.length > 0 ? (
              currentWO.notes.map((note, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-sm">{note.userName}</span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{note.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notes yet</p>
            )}
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Add a note about this work order..."
          />
          <Button 
            className="mt-2" 
            onClick={handleAddNote}
            disabled={isAddingNote || !noteText.trim()}
          >
            {isAddingNote ? 'Adding...' : 'Add Note'}
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Attachments</h3>
          
          {currentWO.attachments && currentWO.attachments.length > 0 && (
            <div className="mb-4 space-y-2">
              {currentWO.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Paperclip size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{file.originalName}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB • {formatRelativeTime(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5000/${file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download size={20} />
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Paperclip className="text-gray-400 mx-auto mb-2" size={48} />
            <p className="text-gray-600 mb-3">Upload images, videos, or documents</p>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mb-3"
            />
            {selectedFile && (
              <div className="mb-3">
                <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>
              </div>
            )}
            <Button
              onClick={handleFileUpload}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Activity Log</h3>
          <div className="space-y-3">
            {currentWO.activityLog && currentWO.activityLog.length > 0 ? (
              currentWO.activityLog.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {log.userName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{log.userName}</p>
                    <p className="text-sm text-gray-600">{log.details}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(log.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};