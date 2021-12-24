import logo from './logo.svg';
import './App.css';
import { Modal, message, Input, Button, Card, Col, Row } from 'antd';
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
    const {who, host, guest, roomname} = room;
    const index = event.target.name;
    if(room.end) return message.error(`棋局已經結束`);
    if(room[who] !== username) return message.error(`等待玩家"${room[who]}"下子`);
    ws.emit('step', {who, index});
  }

  const restartRoom = () => {
    if(!room.end) return message.error(`對弈尚未結束`);
    ws.emit('restart', {username, roomname});
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

  useEffect(()=>{
      if(room.end){
        if(room[room.end] === username) {
          Modal.success({
            content: '恭喜你贏囉！再來一局吧',
          });
        } else {
          Modal.error({
            content: '雖然輸了﹍但國父也是10次才成功，再接再厲囉',
          });
        }
      }
  },[room])

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
    
    ws.on('end', room => {
      setRoom(room);
    })
    
    ws.on('error', data => {
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
        <Col span={24}>{room.count === 1 ? '等待玩家進入' : `等待玩家"${room[room.who]}"下子`}</Col>
        <Col span={8}>
          <Row gutter={[24, 24]}>
            <Col span={24} >
              <Button name="0" onClick={step}>{room.step[0] ? room.step[0].who === 'host' ? 'O' : 'X' : '  '}</Button>
              <Button name="1" onClick={step}>{room.step[1] ? room.step[1].who === 'host' ? 'O' : 'X' : '  '}</Button>
              <Button name="2" onClick={step}>{room.step[2] ? room.step[2].who === 'host' ? 'O' : 'X' : '  '}</Button>
            </Col>
            <Col span={24} >
              <Button name="3" onClick={step}>{room.step[3] ? room.step[3].who === 'host' ? 'O' : 'X' : '  '}</Button>
              <Button name="4" onClick={step}>{room.step[4] ? room.step[4].who === 'host' ? 'O' : 'X' : '  '}</Button>
              <Button name="5" onClick={step}>{room.step[5] ? room.step[5].who === 'host' ? 'O' : 'X' : '  '}</Button>
            </Col>
            <Col span={24} >
              <Button name="6" onClick={step}>{room.step[6] ? room.step[6].who === 'host' ? 'O' : 'X' : '  '}</Button>
              <Button name="7" onClick={step}>{room.step[7] ? room.step[7].who === 'host' ? 'O' : 'X' : '  '}</Button>
              <Button name="8" onClick={step}>{room.step[8] ? room.step[8].who === 'host' ? 'O' : 'X' : '  '}</Button>
            </Col>
          </Row>
        </Col>
        <Col span={16}>
            <Input addonBefore="房間名稱: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.roomname} />
            <Input addonBefore="房主: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.host} />
            <Input addonBefore="訪客: "  style={{ width: 'calc(100% - 200px)' }} disabled value={room.guest} />
        </Col>
        <Col span={24}>
            <Button type="primary" onClick={restartRoom}>重新開始</Button>
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
        <Row>
          <Col span={24}>
            <Card title="井字棋" bordered={false}>
              <Input.Group compact>
            <Input addonBefore="玩家名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="宏宏" value={username} onChange={event => setUsername(event.target.value)} />
            <Input addonBefore="房間名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="吾疆" value={roomname} onChange={event => setRoomname(event.target.value)} />
              </Input.Group>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
              <Button type="primary" onClick={createRoom}>建立房間</Button>
              <Button type="primary" onClick={joinRoom}>加入房間</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}