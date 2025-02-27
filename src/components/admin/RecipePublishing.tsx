import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Recipe status types
type RecipeStatus = 'draft' | 'scheduled' | 'published' | 'archived';

interface RecipeRevision {
  id: string;
  date: Date;
  author: string;
  notes?: string;
}

interface RecipePublishingProps {
  slug: string;
  title: string;
  initialStatus?: RecipeStatus;
  initialScheduledDate?: Date;
  revisions?: RecipeRevision[];
  onPublish: (data: { 
    status: RecipeStatus; 
    scheduledDate?: Date;
    revisionNote?: string;
  }) => void;
  onPreview: () => void;
}

const RecipePublishing: React.FC<RecipePublishingProps> = ({
  slug,
  title,
  initialStatus = 'draft',
  initialScheduledDate,
  revisions = [],
  onPublish,
  onPreview
}) => {
  const [status, setStatus] = useState<RecipeStatus>(initialStatus);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    initialScheduledDate || new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to tomorrow
  );
  const [showScheduler, setShowScheduler] = useState(initialStatus === 'scheduled');
  const [revisionNote, setRevisionNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status background and text classes based on status
  const statusClasses = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    archived: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  // Handle status change
  const handleStatusChange = (newStatus: RecipeStatus) => {
    setStatus(newStatus);
    setShowScheduler(newStatus === 'scheduled');

    // Clear success message when changing status
    setSuccessMessage('');
  };

  // Handle scheduled date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setScheduledDate(date);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Data to send to the parent component
    const publishData = {
      status,
      ...(status === 'scheduled' && { scheduledDate }),
      ...(revisionNote && { revisionNote })
    };

    // Call the onPublish callback
    onPublish(publishData);

    // Show success message
    const statusMessages = {
      draft: 'Recipe saved as draft',
      scheduled: `Recipe scheduled for ${format(scheduledDate as Date, 'PPP')}`,
      published: 'Recipe published successfully',
      archived: 'Recipe archived'
    };
    
    setSuccessMessage(statusMessages[status]);
    setRevisionNote('');
    setIsSubmitting(false);
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all duration-300">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Publishing Settings
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Recipe Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Recipe:</span> {title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Slug:</span> {slug}
          </p>
        </div>

        {/* Status Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {(['draft', 'scheduled', 'published', 'archived'] as RecipeStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                className={`px-3 py-1.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange transition-all ${
                  status === statusOption 
                    ? `${statusClasses[statusOption]} ring-2 ring-offset-2 ring-jamie-orange` 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                }`}
                onClick={() => handleStatusChange(statusOption)}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduling Options (conditionally rendered) */}
        {showScheduler && (
          <div className="mb-6 animate-fade-in">
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Schedule Publication Date
            </label>
            <input
              type="datetime-local"
              id="scheduledDate"
              className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              value={scheduledDate ? format(scheduledDate, "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={handleDateChange}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Recipe will be automatically published at the specified date and time.
            </p>
          </div>
        )}

        {/* Revision Note */}
        <div className="mb-6">
          <label htmlFor="revisionNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Revision Note (optional)
          </label>
          <textarea
            id="revisionNote"
            className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            placeholder="Describe what changed in this revision"
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            rows={2}
          />
        </div>

        {/* Previous Revisions (if available) */}
        {revisions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous Revisions</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {revisions.map((revision) => (
                <div 
                  key={revision.id}
                  className="text-xs bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{format(revision.date, 'PP')}</span>
                    <span>{revision.author}</span>
                  </div>
                  {revision.notes && (
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{revision.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap space-x-3">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Preview Recipe
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-jamie-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {status === 'draft' ? 'Save as Draft' : 
             status === 'scheduled' ? 'Schedule' : 
             status === 'published' ? 'Publish Now' : 'Archive Recipe'}
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-sm flex items-center animate-fade-in">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default RecipePublishing;
