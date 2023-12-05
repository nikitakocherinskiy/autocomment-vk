import { useState } from 'react'
import './styles/App.css'

//223687902
// Минхо - Банчан - Феликс - Хёнджин - Джисон - Чонин - Сынмин - Чанбина на https://vk.com/jelacrois

function App() {
	const [accessToken, setAccessToken] = useState('')
	const [message, setMessage] = useState('')
	const [groupID, setGroupID] = useState('')
	const [isWorking, setIsWorking] = useState('')
	const [loopState, setLoopState] = useState(true)

	let groupPostLast = []
	let lastPostTime = 0
	let lastPostId = 0
	let groupPostCurrent = []
	let currentPostTime = 0
	let currentPostId = 0

	const handleSubmit = async (e) => {
		e.preventDefault()
		// eslint-disable-next-line no-undef
		await VK.Api.call(
			'wall.get',
			{
				owner_id: `-${groupID}`,
				access_token: `${accessToken}`,
				count: 1,
				v: '5.199',
			},
			(r) => {
				try {
					groupPostLast = groupPostLast.concat(r.response.items)
					lastPostTime = groupPostLast[0].date
					lastPostId = groupPostLast[0].id
				} catch (e) {
					console.log(e)
				}
			}
		)
		while (loopState) {
			try {
				// eslint-disable-next-line no-undef
				await VK.Api.call(
					'wall.get',
					{
						owner_id: `-${groupID}`,
						access_token: `${accessToken}`,
						count: 1,
						v: '5.199',
					},
					(r) => {
						try {
							groupPostCurrent = r.response.items
							currentPostTime = groupPostCurrent[0].date
							currentPostId = groupPostCurrent[0].id
						} catch (e) {
							console.log(e)
						}
					}
				)
				await console.log(currentPostTime, lastPostTime)
				await console.log(currentPostId, lastPostId)

				if (lastPostTime !== currentPostTime) {
					// eslint-disable-next-line no-undef
					await VK.Api.call(
						'wall.createComment',
						{
							access_token: `${accessToken}`,
							owner_id: `-${groupID}`,
							post_id: `${currentPostId}`,
							message: `${message}`,
							v: '5.199',
							client_id: 51808492,
							client_secret: 'jufET4tvDsxU48PVu0q5',
							scope: 'wall',
						},
						(r) => {
							try {
								console.log(r)
							} catch (e) {
								console.log(e)
							}
						}
					)
					setLoopState((prev) => !prev)
					console.log('com')
				}
				await new Promise((r) => setTimeout(r, 1000))
			} catch (error) {
				console.error('Error:', error)
			}
		}
	}

	return (
		<>
			<h1>Ну типа как то так</h1>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Токен доступа'
					value={accessToken}
					onChange={(e) => setAccessToken(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Комментарий'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<input
					type='text'
					placeholder='ID группы'
					value={groupID}
					onChange={(e) => setGroupID(e.target.value)}
				/>
				<button type='submit'>Начать</button>
			</form>
		</>
	)
}

export default App
