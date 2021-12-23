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

  const createRoom = () => {
    ws.emit('create', roomname);
    ws.emit('username', username);
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
    ws.on('create', data => {
      message.info(data);
    })
    
    ws.on('leave', data => {
      message.info(data);
    })
    
    ws.on('username', data => {
      message.info(data);
    })
    
    ws.on('error', data => {
      message.error(data);
    })
  }

  const sendMessage = () => {
      //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
      ws.emit('getMessage', '只回傳給發送訊息的 client')
  }
    
  return (
    <div className="site-card-wrapper">
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
        <Row gutter={16}>
          <Col span={8} offset={8}>
              <Button type="primary" value='送出訊息' onClick={sendMessage}>送出訊息</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
  );
}

export default App;
