import { useState } from 'react';
import io from 'socket.io-client';
import { Button, Form, Input } from 'antd';
import Chat from './chat';

const socket = io('http://localhost:3001');

function App() {
	const [showChat, setShowChat] = useState(false);

	const [form] = Form.useForm();
	const [username, setUsername] = useState('');
	const [room, setRoom] = useState('');

	const joinRoom = () => {
		if (username !== '' && room !== '') {
			socket.emit('join_room', room);
			setShowChat(true);
		}
	};

	return (
		<>
			{!showChat ? (
				<section className='h-screen '>
					<div className='h-full'>
						<div className='flex flex-wrap items-center justify-center h-full g-6 lg:justify-between'>
							<div className='mb-12 shrink-1 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12'>
								<img
									src='/src/assets/Secure.png'
									className='w-1/2 ml-10'
									alt='Login image'
								/>
							</div>

							<div className='flex flex-col flex-1 p-4 mr-10 overflow-hidden bg-white border border-gray-200 rounded'>
								<h2 className='mb-4 text-3xl font-bold text-center'>
									Sign in to Chat
								</h2>
								<Form form={form} layout='vertical'>
									<div className='flex justify-between space-x-4'>
										<Form.Item
											name='name'
											label='Name'
											className='flex-1'
											rules={[
												{
													required: true,
													message:
														'Please input your Name',
												},
											]}
										>
											<Input
												placeholder='Your Name (Eg:John Doe)'
												onChange={(e) => {
													setUsername(e.target.value);
												}}
											/>
										</Form.Item>
									</div>
									<Form.Item
										name='roomCode'
										required
										label='Room Code'
										rules={[
											{
												required: true,
												message:
													'Please enter Room Code you want to join!',
											},
										]}
									>
										<Input
											placeholder='Enter Room Code (Eg: Homies)'
											onChange={(e) => {
												setRoom(e.target.value);
											}}
										/>
									</Form.Item>

									<div className='flex items-center justify-center'>
										<Form.Item>
											<Button
												type='primary'
												className='w-40'
												htmlType='submit'
												onClick={joinRoom}
												style={{
													backgroundColor: '#4B68B8',
												}}
											>
												Submit
											</Button>
										</Form.Item>
									</div>
								</Form>
							</div>
						</div>
					</div>
				</section>
			) : (
				<Chat socket={socket} username={username} room={room} />
			)}
		</>

		// <Login />
		// <BrowserRouter>
		// 	<Routes>
		// 		<Route path='/' element={<Login />} />
		// 		<Route path='chat' element={<Chat />} />
		// 	</Routes>
		// </BrowserRouter>
	);
}

export default App;
