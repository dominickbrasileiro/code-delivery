export const getCurrentPosition = (
  options?: PositionOptions
): Promise<{ lat: number; long: number }> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      }),
      error => reject(error),
      options,
    )
  })
}
