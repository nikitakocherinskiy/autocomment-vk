import axios from 'axios'
import { useState } from 'react'

function App() {
	const [accessToken, setAccessToken] = useState('')
	const [message, setMessage] = useState('')
	const [groupID, setGroupID] = useState('')
	const [isWorking, setIsWorking] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		let groupPostLast = await axios.get(
			`https://api.vk.com/method/wall.get?owner_id=-${groupID}&v=5.131&access_token=${accessToken}`
		)
		let lastPostTime = groupPostLast.items[0].date
		let lastPostId = groupPostLast.items[0].id
		const intervalId = setInterval(async () => {
			try {
				print('reload')
				let groupPostCurrent = await axios.get(
					`https://api.vk.com/method/wall.get?owner_id=-${groupID}&v=5.131&access_token=${accessToken}`
				)
				let currentPostTime = groupPostCurrent.items[0].date
				let currentPostId = groupPostCurrent.items[0].id
				if (lastPostTime !== currentPostTime) {
					print(currentPostTime)
					await axios.post(
						`https://api.vk.com/method/wall.createComment?owner_id=-${groupID}&post_id=${currentPostId}&message=${message}&v=5.131&access_token=${accessToken}`
					)
					lastPostTime = currentPostTime
					lastPostId = currentPostId
					clearInterval(intervalId)
				}
			} catch (error) {
				console.error('Error:', error)
			}
		}, 1000)
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Access Token'
					value={accessToken}
					onChange={(e) => setAccessToken(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<input
					type='text'
					placeholder='groupID'
					value={groupID}
					onChange={(e) => setGroupID(e.target.value)}
				/>
				<button type='submit'>Начать</button>
			</form>
		</>
	)
}

export default App
