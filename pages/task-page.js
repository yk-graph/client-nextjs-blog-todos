import { useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import { getAllTasksData } from '../lib/tasks'
import Task from '../components/Task'
import useSWR from 'swr'

/**
 *@useSWR サーバーサイド側の変更を感知してリアルタイムでデータを更新したい時に使う機能
 *@descriotion1 まず getStaticProps でbuild時に作成したAPIのエンドポイントからデータを取得する
 *@descriotion2 getStaticPropsで取得したデータをコンポーネントのpropsとして受け取る(ここまでは従来の流れと同じ)
 *@descriotion3 propsとして渡ってきたデータを初期値(fallbackData)としてuseSWRにセットする → ユーザーがページを見た時はfallbackDataの値が表示される
 *@descriotion4 useEffectを使って、ページがmountされたタイミングでuseSWRのmutate関数が発火させる
 *@descriotion5 useSWRのmutate関数が発火すると、サーバーサイド側の最新のデータを取得してfallbackDataの値を更新する
 *@descriotion6 結果、常に最新のデータがページに反映されるようになる
 */

const fetcher = (url) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`

export default function TaskPage({ staticFilteredTasks }) {
  // ① 第一引数：取得したいエンドポイント
  // ② 第二引数：定義しているfetcher関数
  // ③ 第三引数：初期値(fallbackData)を設定できる。getStaticPropsから取得した値を初期値としている
  // useSWRの返り値は *useSWRを実行して取得したdata と *mutate関数(dataのキャッシュを最新の内容に更新してくれる関数)を受け取れる
  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticFilteredTasks,
  })
  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  useEffect(() => {
    mutate()
  }, [])

  return (
    <Layout title="Task page">
      <ul>
        {filteredTasks &&
          filteredTasks.map((task) => (
            // useSWRの関数を子コンポーネントにも渡して、リアルタイムでサーバーサイド側の情報をfetchしてページに反映させる
            <Task key={task.id} task={task} deleteMutate={mutate} />
          ))}
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
    revalidate: 3,
  }
}
