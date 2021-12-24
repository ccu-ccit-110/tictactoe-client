import logo from './logo.svg';
import './App.css';
import { message, Input, Button, Card, Col, Row } from 'antd';
import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import webSocket from 'socket.io-client'
import _ from 'lodash';

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

  const joinRoom = () => {
    ws.emit('join', {username, roomname});
  }

  const step = (event) => {
    console.log(event.target)
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

    ws.on('join', room => {
      setRoom(room);
      setShowHome(false);
      setShowGame(true);
    })

    ws.on('step', room => {
      setRoom(room);
    })

    ws.on('restart', room => {
      setRoom(room);
    })
    
    ws.on('leave', data => {
      setShowHome(true);
      setShowGame(false);
    })
    
    ws.on('username', data => {
      message.info(data);
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
      joinRoom={joinRoom}
    /> : null}
    {showGame ? (
      <Row align="middle">
        <Col span={24}>{room.count === 1 ? '等待玩家進入' : `等待${room.who === 'host' ? '房主' : '訪客'}"${room[room.who]}"下子`}</Col>
        <Col span={4}>
          <Row gutter={[24, 24]}>
            <Col span={24} >
              <Button name="0" onClick={step}> </Button>
              <Button name="1" onClick={step}> </Button>
              <Button name="2" onClick={step}> </Button>
            </Col>
            <Col span={24} >
              <Button name="3" onClick={step}> </Button>
              <Button name="4" onClick={step}> </Button>
              <Button name="5" onClick={step}> </Button>
            </Col>
            <Col span={24} >
              <Button name="6" onClick={step}> </Button>
              <Button name="7" onClick={step}> </Button>
              <Button name="8" onClick={step}> </Button>
            </Col>
          </Row>
        </Col>
        <Col span={20}>
            <Input addonBefore="房間名稱: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.roomname} />
            <Input addonBefore="房主: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.host} />
            <Input addonBefore="訪客: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.guest} />
        </Col>
        <Col span={24}>
            <Button type="primary" onClick={leaveRoom}>離開房間</Button>
        </Col>
      </Row>
    ):null}
    
  </div>
  );
}

export default App;

const Home = ({username, setUsername, roomname, setRoomname, createRoom, leaveRoom, joinRoom}) => {
  return  (
    <Row align="middle">
      <Col span={24}>
        <Row gutter={16}>
          <Col span={8} offset={8}>
            <Card title="井字棋" bordered={false}>
              <Input.Group compact>
            <Input addonBefore="玩家名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="宏宏" value={username} onChange={event => setUsername(event.target.value)} />
            <Input addonBefore="房間名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="吾疆" value={roomname} onChange={event => setRoomname(event.target.value)} />
              </Input.Group>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8} offset={8}>
              <Button type="primary" onClick={createRoom}>建立房間</Button>
              <Button type="primary" onClick={joinRoom}>加入房間</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}