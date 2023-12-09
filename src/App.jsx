/* eslint-disable no-undef */
import { useState } from "react"
import "./styles/App.css"
import { MutatingDots } from "react-loader-spinner"

function App() {
  const [accessToken, setAccessToken] = useState("")
  const [message, setMessage] = useState("")
  const [groupID, setGroupID] = useState("")
  const [isWorking, setIsWorking] = useState(true)
  const [groupPostLast, setGroupPostLast] = useState({})
  const [lastPostTime, setLastPostTime] = useState(0)
  const [lastPostId, setLastPostId] = useState(0)
  const [groupPostCurrent, setGroupPostCurrent] = useState({})
  const [currentPostTime, setCurrentPostTime] = useState(0)
  const [currentPostId, setCurrentPostId] = useState(0)
  const [clickState, setClickState] = useState(false)
  // const [change, setChange] = useState(true)
  let change = true

  const commentPost = async (postId) => {
    await VK.Api.call(
      "wall.createComment",
      {
        access_token: `${accessToken}`,
        owner_id: `-${groupID}`,
        post_id: `${postId}`,
        message: `${message}`,
        v: "5.199",
        client_id: 51808492,
        client_secret: "jufET4tvDsxU48PVu0q5",
        scope: "wall",
      },
      (r) => {
        try {
          console.log("comment success")
          console.log(r)
        } catch (e) {
          console.log(e)
        }
      }
    )
  }

  const getLastPost = async () => {
    await VK.Api.call(
      "wall.get",
      {
        owner_id: parseInt(`-${groupID}`),
        access_token: `${accessToken}`,
        count: 1,
        v: "5.199",
      },
      (r) => {
        setGroupPostLast(r.response.items[0])
        setLastPostTime(r.response.items[0].date)
        setLastPostId(r.response.items[0].id)
        console.log("Last post ID:", r.response.items[0])
        console.log(lastPostId, currentPostId)
      }
    )
  }

  const handleClick = async () => {
    setClickState(true)
    while (change) {
      await VK.Api.call(
        "wall.get",
        {
          owner_id: parseInt(`-${groupID}`),
          access_token: `${accessToken}`,
          count: 1,
          v: "5.199",
        },
        (r) => {
          console.log(r)
          setGroupPostCurrent(r.response.items[0])
          console.log("Current post ID:", r.response.items[0])
          console.log(lastPostId, r.response.items[0].id)
          if (
            lastPostTime !== r.response.items[0].date &&
            r.response.items[0].date !== 0
          ) {
            console.log("condition")
            commentPost(r.response.items[0].id)
            setLastPostTime(r.response.items[0].date)
            setLastPostId(r.response.items[0].id)
            change = false
            // clearInterval(intervalId)
            //@ts-ignore
          }
        }
      )
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  return (
    <>
      <h1>Ну типа как то так</h1>
      <span>ID последнего поста: {lastPostId}</span>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type='text'
            placeholder='Токен доступа'
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
          <input
            type='text'
            placeholder='ID группы'
            value={groupID}
            onChange={(e) => setGroupID(e.target.value)}
          />
          <button onClick={getLastPost}>Получить пост</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type='text'
            placeholder='Комментарий'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleClick}>Начать</button>
        </div>
        {change && clickState && (
          <div>
            <span>Работает</span>
            <MutatingDots
              height='100'
              width='100'
              color='#4fa94d'
              secondaryColor='#4fa94d'
              radius='10.5'
              ariaLabel='mutating-dots-loading'
              wrapperStyle={{}}
              wrapperClass=''
              visible={true}
            />
          </div>
        )}
      </form>
    </>
  )
}

export default App
