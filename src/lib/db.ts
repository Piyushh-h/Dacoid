interface QuizAttempt {
    id?: number
    date: Date
    score: number
    totalQuestions: number
    answers: {
      questionId: number
      userAnswer: string | number
      correct: boolean
    }[]
  }
  
  const DB_NAME = "QuizDatabase"
  const STORE_NAME = "attempts"
  const DB_VERSION = 1
  
  export async function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
        }
      }
    })
  }
  
  export async function saveAttempt(attempt: QuizAttempt): Promise<void> {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.add(attempt)
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  export async function getAttempts(): Promise<QuizAttempt[]> {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
  
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }