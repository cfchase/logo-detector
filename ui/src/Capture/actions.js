export const CREATE_PHOTO = "Status.CREATE_PHOTO";
export const createPhoto = (photo) => ({
  type: CREATE_PHOTO,
  payload: {
    photo
  }
});

export const CREATE_PHOTO_PENDING = "Status.CREATE_PHOTO_PENDING";
export const createPhotoPending = () => ({
  type: CREATE_PHOTO_PENDING
});


export const CREATE_PHOTO_FULFILLED = "Status.CREATE_PHOTO_FULFILLED";
export const createPhotoFulfilled = (response) => ({
  type: CREATE_PHOTO_FULFILLED,
  payload: {
    response
  }
});

export const CREATE_PHOTO_REJECTED = "Status.CREATE_PHOTO_REJECTED";
export const createPhotoRejected = (error) => ({
  type: CREATE_PHOTO_REJECTED,
  payload: {
    error
  }
});
