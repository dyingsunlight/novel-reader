export const ExtendedPromiseAll = async function(fromJobsQueue, maximumRuiningJobSameTime = 32) {
  await new Promise(resolve => {
    let jobQueuePointer = -1
    let ruiningJobs = 0
    
    const jobQueue = fromJobsQueue.map(job => {
      return async () => {
        await job()
        finishJob()
      }
    })
    
    const finishJob = () => {
      updateJobQueue()
      ruiningJobs--
      if (ruiningJobs <= 0) {
        resolve()
      }
    }
    
    const updateJobQueue = () => {
      
      if (!jobQueue[jobQueuePointer + 1] && ruiningJobs === 0) {
        return
      }
      
      if (maximumRuiningJobSameTime > ruiningJobs && jobQueue[jobQueuePointer + 1]) {
        jobQueuePointer++
        ruiningJobs++
        jobQueue[jobQueuePointer]()
        updateJobQueue()
      }
    }
    
    updateJobQueue()
  })
}

export function randomString(length: number = 10, charsets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = ''
  const characters = charsets
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}


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
      window.clearTimeout(lastScheduleTimerId)
      lastScheduleTimerId = window.setTimeout(handler, duration)
    }
  }
}


export function joinTextWithMarker(texts: string[], marker: string) {
  return texts.join(`\n\n${marker}\n\n`)
}

export function generateMarker(forText: string[]) {
  let internalMarker
  while (!internalMarker || forText.some(text => text.includes(internalMarker))) {
    internalMarker = `${randomString(6, `1234567890`)}`
  }
  return internalMarker
}
