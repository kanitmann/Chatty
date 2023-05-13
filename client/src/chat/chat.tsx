import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import ScrollToBottom from 'react-scroll-to-bottom';

interface ChatProps {
	socket: any;
	username: string;
	room: string;
}

function Chat({ socket, username, room }: ChatProps) {
	const [form] = Form.useForm();

	const [currentMessage, setCurrentMessage] = useState('');
	const [messageList, setMessageList] = useState<any[]>([]);

	const sendMessage = async () => {
		if (currentMessage !== '') {
			const messageData = {
				room: room,
				author: username,
				message: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					':' +
					new Date(Date.now()).getMinutes(),
			};

			await socket.emit('send_message', messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage('');
		}
	};

	useEffect(() => {
		socket.on('receive_message', (data: any) => {
			setMessageList((list) => [...list, data]);
		});
	}, [socket]);
	return (
		<div className='flex flex-col w-full h-screen text-white bg-gray-800'>
			{/* header */}
			<div className='p-4 font-mono text-2xl font-bold text-left bg-gray-700 rounded-t-lg'>
				🟢 {room}
				{/* body */}
			</div>
			{/* body */}
			<div className='pb-4 overflow-y-auto h-3/4'>
				<ScrollToBottom className='flex h-full overflow-y-auto'>
					{messageList.map((messageContent) => {
						return (
							<>
								{username === messageContent.author ? (
									<div className='flex justify-end'>
										<div>
											<div className='w-auto h-auto px-4 py-2 mx-4 mt-4 text-white break-words align-middle bg-green-500 rounded-xl border-5 max-w-32'>
												<p>{messageContent.message}</p>
											</div>
											<div className='flex justify-end px-4'>
												<p id='time'>
													{messageContent.time}
												</p>
												<p id='author'>
													- {messageContent.author}
												</p>
											</div>
										</div>
									</div>
								) : (
									<div className='flex justify-start'>
										<div>
											<div className='w-auto h-auto px-4 py-2 mx-4 mt-4 text-white break-words align-middle bg-red-500 rounded-xl border-5 max-w-32'>
												<p>{messageContent.message}</p>
											</div>
											<div className='flex px-4'>
												<p id='time'>
													{messageContent.time}
												</p>
												<p id='author'>
													- {messageContent.author}
												</p>
											</div>
										</div>
									</div>
								)}
							</>
						);
					})}
				</ScrollToBottom>
			</div>
			{/* footer */}
			<div className='fixed inset-x-0 bottom-0 p-4 text-2xl text-left bg-gray-700 rounded-b-lg'>
				<Form form={form} layout='vertical'>
					<Input
						type='text'
						placeholder='Type a message'
						onChange={(e) => {
							setCurrentMessage(e.target.value);
						}}
					/>

					<Form.Item>
						<Button
							onClick={sendMessage}
							htmlType='submit'
							className='mt-5 text-white bg-green-500 hover:bg-green-700'
						>
							Send &#9658;
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}

export default Chat;
