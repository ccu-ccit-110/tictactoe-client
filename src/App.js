import logo from './logo.svg';
import './App.css';
import { Input, Button, Card, Col, Row } from 'antd';
import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import webSocket from 'socket.io-client'

function App() {
  const [ws,setWs] = useState(null)

    const connectWebSocket = () => {
        //開啟
        setWs(webSocket('ws://localhost:3001'))
    }

    useEffect(()=>{
        if(ws){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
        }
    },[ws])

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws.on('getMessage', message => {
            console.log(message)
        })
    }

    const sendMessage = () => {
        //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
        ws.emit('getMessage', '只回傳給發送訊息的 client')
    }
    
  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={8} offset={8}>
        <Card title="井字棋" bordered={false}>
          <Input.Group compact>
            <Input addonBefore="玩家名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="宏宏" />
            <Input addonBefore="房間名稱"  style={{ width: 'calc(100% - 200px)' }} placeholder="吾疆" />
            <Button type="primary">加入房間</Button>
          </Input.Group>
        </Card>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8} offset={8}>
          <Button type="primary" value='連線' onClick={connectWebSocket}>連線</Button>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={8} offset={8}>
          <Button type="primary" value='送出訊息' onClick={sendMessage}>送出訊息</Button>
      </Col>
    </Row>
  </div>
  );
}

export default App;
