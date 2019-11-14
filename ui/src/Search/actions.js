export const RESET_SEARCH = "Search.RESET_SEARCH";
export const resetSearch = () => ({
  type: RESET_SEARCH,
  payload: {}
});

export const SEARCH_PHOTO = "Search.SEARCH_PHOTO";
export const searchPhoto = (photo) => ({
  type: SEARCH_PHOTO,
  payload: {
    photo
  }
});

export const SEARCH_PHOTO_PENDING = "Search.SEARCH_PHOTO_PENDING";
export const searchPhotoPending = () => ({
  type: SEARCH_PHOTO_PENDING
});

export const SEARCH_PHOTO_FULFILLED = "Search.SEARCH_PHOTO_FULFILLED";
export const searchPhotoFulfilled = (response) => ({
  type: SEARCH_PHOTO_FULFILLED,
  payload: {
    response
  }
});

export const SEARCH_PHOTO_REJECTED = "Search.SEARCH_PHOTO_REJECTED";
export const searchPhotoRejected = (error) => ({
  type: SEARCH_PHOTO_REJECTED,
  payload: {
    error
  }
});
