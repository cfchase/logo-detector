export const RESET_CAPTURE = "Capture.RESET_CAPTURE";
export const resetCapture = () => ({
  type: RESET_CAPTURE,
  payload: {}
});

export const CREATE_PHOTO = "Capture.CREATE_PHOTO";
export const createPhoto = (photo) => ({
  type: CREATE_PHOTO,
  payload: {
    photo
  }
});

export const CREATE_PHOTO_PENDING = "Capture.CREATE_PHOTO_PENDING";
export const createPhotoPending = () => ({
  type: CREATE_PHOTO_PENDING
});


export const CREATE_PHOTO_FULFILLED = "Capture.CREATE_PHOTO_FULFILLED";
export const createPhotoFulfilled = (response) => ({
  type: CREATE_PHOTO_FULFILLED,
  payload: {
    response
  }
});

export const CREATE_PHOTO_REJECTED = "Capture.CREATE_PHOTO_REJECTED";
export const createPhotoRejected = (error) => ({
  type: CREATE_PHOTO_REJECTED,
  payload: {
    error
  }
});
