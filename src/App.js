import logo from './logo.svg';
import './App.css';
import { message, Input, Button, Card, Col, Row } from 'antd';
import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import webSocket from 'socket.io-client'

function App() {
  const [ws,setWs] = useState(null)
  const [username, setUsername] = useState('');
  const [roomname, setRoomname] = useState('');
  const [room, setRoom] = useState({});
  const [showHome, setShowHome] = React.useState(true);
  const [showGame, setShowGame] = React.useState(false);

  const createRoom = () => {
    ws.emit('create', {username, roomname});
  }

  const leaveRoom = () => {
    ws.emit('leave', roomname);
  }

  const useMountEffect = (fun) => useEffect(fun, [])
  useMountEffect(()=>{
    setWs(webSocket('ws://localhost:3001'));
  })

  useEffect(()=>{
      if(ws){
          //連線成功在 console 中打印訊息
          console.log('success connect!')
          //設定監聽
          initWebSocket()
      }
  },[ws])

  const initWebSocket = () => {
    ws.on('create', room => {
      setRoom(room);
      setShowHome(false);
      setShowGame(true);
    })
    
    ws.on('leave', data => {
      setShowHome(true);
      setShowGame(false);
    })
    
    ws.on('username', data => {
      message.info(data);
    })
    
    ws.on('error', data => {
      console.log(data)
      message.error(data);
    })
  }
    
  return (
  <div className="site-card-wrapper">
    {showHome ? <Home 
      username={username} 
      setUsername={setUsername} 
      roomname={roomname} 
      setRoomname={setRoomname} 
      createRoom={createRoom} 
      leaveRoom={leaveRoom}
    /> : null}
    {showGame ? (
      <Row justify="space-around" align="middle">
        <Col span={12}>
          <Row gutter={[24, 24]}>
            <Col span={8} />
            <Col span={8} />
            <Col span={8} />

            <Col span={8} />
            <Col span={8} />
            <Col span={8} />

            <Col span={8} />
            <Col span={8} />
            <Col span={8} />
          </Row>
        </Col>
        <Col span={12}>
            <Input addonBefore="房間名稱: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.roomname} />
            <Input addonBefore="房主: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.host} />
            <Input addonBefore="訪客: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.guest} />
            <Button type="primary" onClick={leaveRoom}>離開房間</Button>
        </Col>
      </Row>
    ):null}
    
  </div>
  );
}

export default App;

const Home = ({username, setUsername, roomname, setRoomname, createRoom, leaveRoom}) => {
  return  (
    <Row align="middle">
      <Col span={24}>
        <Row gutter={16}>
          <Col span={8} offset={8}>
            <Card title="井字棋" bordered={false}>
              <Input.Group compact>
            <Input addonBefore="玩家名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="宏宏" value={username} onChange={event => setUsername(event.target.value)} />
            <Input addonBefore="房間名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="吾疆" value={roomname} onChange={event => setRoomname(event.target.value)} />
                <Button type="primary">加入房間</Button>
              </Input.Group>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8} offset={8}>
              <Button type="primary" onClick={createRoom}>建立房間</Button>
              <Button type="primary" onClick={leaveRoom}>離開房間</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}