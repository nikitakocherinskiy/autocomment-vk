import { useState } from 'react'
/*eslint-disable */
//223687902
// Минхо - Банчан - Феликс - Хёнджин - Джисон - Чонин - Сынмин - Чанбина на https://vk.com/jelacrois
// vk1.a.q2TyECCngz45Rze7Fd8EpAtOSBbBaFuE5HfkBZHvU9bYr0l1N3dElNK_pzI1MvBYD_z0V4-kIdV0Vy3Vt6K9ELzJrXPyljh4zxfjSSgVaGiq3j9rP05TwixUC62YSF6O7AyJeXcyYHoYoRuTAETYx-5uMPXVHI2qrA2rNmnEm87XZht38dplKLjBDlwbbRTT_tASeKo0deTIPww1-Niobg
function App() {
	const [accessToken, setAccessToken] = useState('')
	const [message, setMessage] = useState('')
	const [groupID, setGroupID] = useState('')
	const [isWorking, setIsWorking] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		let groupPostLast = await VK.Api.call(
			'wall.get',
			{
				owner_id: `-${groupID}`,
				access_token: `${accessToken}`,
				v: '5.131',
			},
			(r) => {
				try {
					return r
				} catch (e) {
					console.log(e)
				}
			}
		)
		console.log(groupPostLast)
		let lastPostTime = groupPostLast.items[0].date
		let lastPostId = groupPostLast.items[0].id
		const intervalId = setInterval(async () => {
			try {
				console.log('reload')
				// let groupPostCurrent = await axios.get(
				// 	`https://api.vk.com/method/wall.get?owner_id=-${groupID}&v=5.131&access_token=${accessToken}`
				// )
				let groupPostCurrent = await VK.Api.call('wall.get', {
					owner_id: `-${groupID}`,
					access_token: `${accessToken}`,
					v: '5.131',
				})
				let currentPostTime = groupPostCurrent.items[0].date
				let currentPostId = groupPostCurrent.items[0].id
				if (lastPostTime !== currentPostTime) {
					print(currentPostTime)
					// await axios.post(
					// 	`https://api.vk.com/method/wall.createComment?owner_id=-${groupID}&post_id=${currentPostId}&message=${message}&v=5.131&access_token=${accessToken}`
					// )

					await VK.Api.call('wall.createComment', {
						owner_id: `-${groupID}`,
						post_id: `${currentPostId}`,
						message: `${message}`,
						access_token: `${accessToken}`,
						v: '5.131',
					})
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
