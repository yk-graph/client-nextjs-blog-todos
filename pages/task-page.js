import Layout from '../components/Layout'
import Link from 'next/link'
import { getAllTasksData } from '@/lib/tasks'
import Task from '@/components/Task'

export default function TaskPage({ staticFilteredTasks }) {
  return (
    <Layout title="Task page">
      <ul>
        {staticFilteredTasks &&
          staticFilteredTasks.map((task) => <Task key={task.id} task={task} />)}
      </ul>
      <Link href="/main-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span>Back to main page</span>
        </div>
      </Link>
    </Layout>
  )
}

export async function getStaticProps() {
  const staticFilteredTasks = await getAllTasksData()

  return {
    props: { staticFilteredTasks },
  }
}
