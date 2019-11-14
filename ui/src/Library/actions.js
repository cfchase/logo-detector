export const UPLOAD_FILE = "Library.UPLOAD_FILE";
export const uploadFile = (file) => ({
  type: UPLOAD_FILE,
  payload: {
    file
  }
});

export const UPLOAD_FILE_PENDING = "Library.UPLOAD_FILE_PENDING";
export const uploadFilePending = () => ({
  type: UPLOAD_FILE_PENDING
});


export const UPLOAD_FILE_FULFILLED = "Library.UPLOAD_FILE_FULFILLED";
export const uploadFileFulfilled = (response) => ({
  type: UPLOAD_FILE_FULFILLED,
  payload: {
    response
  }
});

export const UPLOAD_FILE_REJECTED = "Library.UPLOAD_FILE_REJECTED";
export const uploadFileRejected = (error) => ({
  type: UPLOAD_FILE_REJECTED,
  payload: {
    error
  }
});
