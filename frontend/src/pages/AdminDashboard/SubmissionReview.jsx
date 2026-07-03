import React, { useState } from 'react';
import { videoService } from '../../services/api';
import { useNotificationStore } from '../../store/index';

export const SubmissionReview = ({ submission, onReviewComplete }) => {
  const [reviewStatus, setReviewStatus] = useState('');
  const [believeValue, setBelieveValue] = useState(submission.task?.believeValueReward || 0);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await videoService.reviewSubmission({
        submissionId: submission._id,
        reviewStatus,
        believeValueAwarded: reviewStatus === 'approved' ? believeValue : 0,
        adminNotes,
      });

      addNotification({
        type: 'success',
        message: `Submission ${reviewStatus} successfully!`,
      });

      onReviewComplete();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to review submission',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold">Review Submission</h2>
          <p className="text-blue-100 mt-2">
            {submission.familyId?.familyName} - {submission.taskId?.title}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Video Preview */}
          {submission.videoUrl && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">📹 Video Submission</h3>
              <video
                src={submission.videoUrl}
                controls
                className="w-full rounded-lg bg-black"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Review Form */}
          <form onSubmit={handleReview} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="approved">✓ Approve</option>
                <option value="rejected">✗ Reject</option>
              </select>
            </div>

            {reviewStatus === 'approved' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Believe Points to Award
                </label>
                <input
                  type="number"
                  value={believeValue}
                  onChange={(e) => setBelieveValue(parseInt(e.target.value))}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Add any notes or feedback..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onReviewComplete}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reviewStatus}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Reviewing...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionReview;
