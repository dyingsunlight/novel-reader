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
