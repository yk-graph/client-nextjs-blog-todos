import Layout from '@/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getAllPostIds, getPostData } from '@/lib/posts'

export default function Post({ post }) {
  const router = useRouter()

  // 存在していないIDにアクセスがあった場合、isFallbackの値がtrueになる
  if (router.isFallback || !post) {
    return <div>Loading...</div>
  }

  return (
    <Layout title={post.title}>
      <p className="m-4">
        {'ID : '}
        {post.id}
      </p>
      <p className="mb-4 text-xl font-bold">{post.title}</p>
      <p className="mb-12">{post.created_at}</p>
      <p className="px-10">{post.content}</p>
      <Link href="/blog-page">
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
          <span>Back to blog-page</span>
        </div>
      </Link>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = await getAllPostIds()

  return {
    paths,
    // fallback: false, 存在しないidが指定されたら404ページへリダイレクトされるが、新たに動的にidが作られた場合でも404になってしまう
    // それを防ぐ場合はfallback: true, にする が!!!!NextのUPDATEによって、内容変わってるかも。。。
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const { post } = await getPostData(params.id)

  return {
    props: {
      post,
    },
    revalidate: 3,
  }
}
