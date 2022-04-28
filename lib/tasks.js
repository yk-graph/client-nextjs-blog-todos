import fetch from 'node-fetch'

export async function getAllTasksData() {
  const res = await fetch(new URL(`http://127.0.0.1:8000/api/list-task/`))
  const tasks = await res.json()
  const staticFilteredTasks = tasks.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )
  return staticFilteredTasks
}

export async function getAllTaskIds() {
  const res = await fetch(new URL(`http://127.0.0.1:8000/api/list-task/`))
  const tasks = await res.json()
  return tasks.map((task) => {
    return {
      params: {
        id: String(task.id),
      },
    }
  })
}

export async function getTaskData(id) {
  const res = await fetch(new URL(`http://127.0.0.1:8000/api/tasks/${id}`))
  const task = res.json()
  return {
    task,
  }
}
