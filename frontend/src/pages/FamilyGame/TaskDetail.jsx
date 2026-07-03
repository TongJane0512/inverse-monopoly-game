import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/api';
import { useNotificationStore } from '../../store/index';

export const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoFile, setVideoFile] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the task details
    // For now, we'll use mock data
    setTask({
      _id: taskId,
      title: 'Help the Elderly Cross Street',
      description: 'Show compassion by helping someone in need. Record a video of your family helping the elderly cross the street safely.',
      taskType: 'crisis',
      beliefRequired: 'compassion',
      believeValueReward: 15,
      requiresVideo: true,
      requiresPhoto: false,
      requiresAnswer: false,
    });
    setIsLoading(false);
  }, [taskId]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        addNotification({
          type: 'error',
          message: 'Video file is too large (max 50MB)',
        });
      } else {
        setVideoFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would upload the video first, then submit the task
      // For now, we'll just simulate the submission
      await taskService.submitTask(taskId, {
        videoUrl: videoFile ? 'video-url' : null,
        textAnswer,
      });

      addNotification({
        type: 'success',
        message: 'Task submitted successfully! Waiting for review...',
      });

      setTimeout(() => navigate('/game'), 1500);
    } catch (error) {
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit task',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/game')}
          className="mb-4 text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-2"
        >
          ← Back to Game
        </button>

        {/* Task Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{task?.title}</h1>
              <p className="text-gray-600 mt-2">{task?.description}</p>
            </div>
            <span className="text-4xl">
              {task?.beliefRequired === 'compassion' && '❤️'}
              {task?.beliefRequired === 'hope' && '🌟'}
              {task?.beliefRequired === 'faith' && '🙏'}
              {task?.beliefRequired === 'perseverance' && '💪'}
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
              +{task?.believeValueReward} Points
            </span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
              {task?.beliefRequired ? task?.beliefRequired.toUpperCase() : 'FAITH'}
            </span>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">📤 Submit Your Solution</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {task?.requiresVideo && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  📹 Upload Video Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-input"
                  />
                  <label htmlFor="video-input" className="cursor-pointer">
                    {videoFile ? (
                      <div>
                        <p className="text-green-600 font-semibold">✓ {videoFile.name}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600">Drag and drop your video here</p>
                        <p className="text-gray-400 text-sm mt-2">or click to select</p>
                        <p className="text-gray-400 text-xs mt-2">Max size: 50MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {task?.requiresAnswer && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  📝 Your Answer
                </label>
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Describe how your family completed this mission..."
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/game')}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!videoFile && task?.requiresVideo)}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
