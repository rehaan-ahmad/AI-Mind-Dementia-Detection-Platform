
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AudioRecorder } from './audio-recorder';
import { Toaster } from './ui/toaster';

// Mock MediaRecorder API
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  state: 'inactive',
  dispatchEvent: jest.fn(),
  ondataavailable: jest.fn(),
  onerror: jest.fn(),
  stream: {} as MediaStream,
  mimeType: '',
  onpause: jest.fn(),
  onresume: jest.fn(),
  onstart: jest.fn(),
  onstop: jest.fn(),
  requestData: jest.fn(),
};

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockMediaRecorder),
});

Object.defineProperty(window.URL, 'createObjectURL', {
    writable: true,
    value: jest.fn().mockReturnValue('blob:http://localhost/mock-audio-url')
})

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
  },
});

describe('AudioRecorder Component', () => {
  const mockOnRecordingComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders recording interface correctly', async () => {
    render(
      <AudioRecorder onRecordingComplete={mockOnRecordingComplete} maxDuration={60} instructions="Please describe the picture" />
    );

    expect(screen.getByText('Please describe the picture')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: { sampleRate: 16000, channelCount: 1 } }));
  });

  test('starts recording when start button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AudioRecorder
        onRecordingComplete={mockOnRecordingComplete}
        maxDuration={60}
        instructions="Please describe the picture"
      />
    );

    const startButton = screen.getByRole('button', { name: /start recording/i });
    await user.click(startButton);

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: { sampleRate: 16000, channelCount: 1 } });
    expect(mockMediaRecorder.start).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument();
  });

  test('handles microphone permission denial', async () => {
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce(
      new Error('Permission denied')
    );
    const mockOnError = jest.fn();

    render(
        <>
            <Toaster />
            <AudioRecorder
                onRecordingComplete={mockOnRecordingComplete}
                onError={mockOnError}
                maxDuration={60}
                instructions="Please describe the picture"
            />
        </>
    );

    await waitFor(() => {
      expect(screen.getByText(/Microphone Access Denied/i)).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalledWith('Microphone access denied. Please enable it in your browser settings.');
    });
  });

  test('automatically stops recording at max duration', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <AudioRecorder
        onRecordingComplete={mockOnRecordingComplete}
        maxDuration={5} // 5 seconds for testing
        instructions="Please describe the picture"
      />
    );

    const startButton = screen.getByRole('button', { name: /start recording/i });
    await user.click(startButton);

    // Fast-forward 5 seconds
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(mockMediaRecorder.stop).toHaveBeenCalled();
    });

    jest.useRealTimers();
  });

  test('displays recording duration timer', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <AudioRecorder
        onRecordingComplete={mockOnRecordingComplete}
        maxDuration={60}
        instructions="Please describe the picture"
      />
    );

    const startButton = screen.getByRole('button', { name: /start recording/i });
    await user.click(startButton);

    // Advance timer by 3 seconds
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.getByTestId('timer')).toHaveTextContent('00:03 / 01:00');
    });

    jest.useRealTimers();
  });
});

describe('AudioRecorder Integration', () => {
    test('complete recording workflow', async () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' });
      const mockOnComplete = jest.fn();
      const user = userEvent.setup();
  
      // Mock the MediaRecorder behavior
      let dataAvailableCallback: (event: { data: Blob }) => void;
      let stopCallback: () => void;
  
      mockMediaRecorder.addEventListener.mockImplementation((event, callback) => {
        if (event === 'dataavailable') {
          dataAvailableCallback = callback;
        }
        if (event === 'stop') {
          stopCallback = callback;
        }
      });
  
      mockMediaRecorder.stop.mockImplementation(() => {
        // When stop is called, we should trigger dataavailable and then stop
        if (dataAvailableCallback) {
          dataAvailableCallback({ data: mockBlob });
        }
        if (stopCallback) {
          stopCallback();
        }
      });
  
      render(
        <AudioRecorder
          onRecordingComplete={mockOnComplete}
          maxDuration={60}
          instructions="Test recording"
        />
      );
  
      // Start recording
      const startButton = screen.getByRole('button', { name: /start recording/i });
      await user.click(startButton);
      
      // Stop recording
      const stopButton = await screen.findByRole('button', { name: /stop recording/i });
      await user.click(stopButton);
  
      // Wait for review UI to appear
      const analyzeButton = await screen.findByRole('button', { name: /analyze recording/i });
      expect(analyzeButton).toBeInTheDocument();
      
      // Click analyze
      await user.click(analyzeButton);
  
      // Wait for completion callback
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(mockBlob, expect.any(Number));
      });
    });
  });
