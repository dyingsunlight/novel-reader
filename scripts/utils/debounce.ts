export function debounce(handler: Function, duration: number = 500, limit = Number.MAX_SAFE_INTEGER) {
  
  let lastScheduleTimerId = null
  let lastExecute
  let timeAccumulated = 0
  
  return () => {
    if (!lastExecute) lastExecute = Date.now()
    
    timeAccumulated += lastExecute - Date.now()
    
    if (timeAccumulated > limit) {
      timeAccumulated = 0
      lastExecute = null
      return handler()
    } else {
      lastExecute = Date.now()
      clearTimeout(lastScheduleTimerId)
      lastScheduleTimerId = setTimeout(handler, duration)
    }
  }
}
