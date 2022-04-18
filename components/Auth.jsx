import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie' // Cookieを使用するためのライブラリをimport

import { LockClosedIcon } from '@heroicons/react/solid'

export default function Auth() {
  const router = useRouter()
  const cookie = new Cookies() //universal-cookieでCookieを使う時の宣言

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  /**
   *@description ログイン成功時にはCookieにtokenを付与するための関数
   */
  const login = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/auth/jwt/create/`,
        {
          method: 'POST', // fetchメソッドでPOSTリクエストを送る時の記述
          // fetchメソッドでPOSTリクエストを送る時のbodyの内容はJSON.stringifyでjson形式にする
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            'Content-Type': 'application/json', // POSTリクエストの時は必須
          },
        }
      )
        .then((res) => {
          // 返却値はresとdataになる
          if (res.status === 400) {
            throw 'authentication failed' // statusが400だったらthrowで例外処理を記述
          } else if (res.ok) {
            return res.json()
          }
        })
        .then((data) => {
          const options = { path: '/' }
          // 第一引数：cookieのkey名, 第二引数：cookieのvalueの値, 第三引数：指定したパスの中でcookieが有効に使えるという制限
          cookie.set('access_token', data.access, options)
        })
      router.push('/main-page')
    } catch (error) {
      alert(error)
    }
  }

  /**
   *@description submitボタン押下後にログインもしくは新規ユーザー登録+ログインをするための関数
   */
  const authUser = async (e) => {
    e.preventDefault()
    if (isLogin) {
      login()
    } else {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/register/`, {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (res.status === 400) {
              throw 'authentication failed'
            } else if (res.status === 201) {
              return res.json()
            }
          })
          .then((data) => {
            alert(`${data.username}さん、登録ありがとうございます！`)
            login()
          })
      } catch (error) {
        alert(error)
      }
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            start your 14-day free trial
          </a>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={authUser}>
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-sm">
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-white hover:text-indigo-500 cursor-pointer"
            >
              Change mode ?
            </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  )
}
