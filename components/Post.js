import Link from 'next/link'

export default function Post({ post }) {
  return (
    <li>
      <span>{post.id}</span>
      {' : '}
      <Link href={`/posts/${post.id}`}>
        <span className="cursol-pointer text-white border-b border-gray-500 hover:bg-gray-600">
          {post.title}
        </span>
      </Link>
    </li>
  )
}
