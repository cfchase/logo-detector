export const RESET_VIDEO = "Video.RESET_VIDEO";
export const resetVideo = () => ({
  type: RESET_VIDEO,
  payload: {}
});

export const PROCESS_FRAME = "Video.PROCESS_FRAME";
export const processFrame = (photo, width, height) => ({
  type: PROCESS_FRAME,
  payload: {
    photo
  }
});

export const PROCESS_FRAME_PENDING = "Video.PROCESS_FRAME_PENDING";
export const processFramePending = () => ({
  type: PROCESS_FRAME_PENDING
});

export const PROCESS_FRAME_FULFILLED = "Video.PROCESS_FRAME_FULFILLED";
export const processFrameFulfilled = (response) => ({
  type: PROCESS_FRAME_FULFILLED,
  payload: {
    response
  }
});

export const PROCESS_FRAME_REJECTED = "Video.PROCESS_FRAME_REJECTED";
export const processFrameRejected = (error) => ({
  type: PROCESS_FRAME_REJECTED,
  payload: {
    error
  }
});
