import { ipcRenderer } from 'electron';
import IconPng from './assets/weread.ico'
import { CloseOutlined, MinusOutlined, BorderOutlined, SwitcherOutlined } from '@ant-design/icons';
import React = require('react');
import "./App.css";
import "./App.scss";
const trueAsStr = 'true' as any

export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isMaximize: false
    };

  };
  componentDidMount() {
    ipcRenderer.on("main-window-max", event => {
      this.setState({ isMaximize: true })
    });
    ipcRenderer.on("main-window-unmax", event => {
      this.setState({ isMaximize: false })
    });

  }

  render() {
    return <div className="app">
      <div className="header">
        <div>
          <img src={IconPng} style={{ height: "36px", alignItems: "center", padding: "5px 15px" }} />
          <span style={{ height: "36px", alignItems: "center", fontWeight: "bold", fontSize: "large" }} >微信阅读PC版</span>
        </div>
        <div className="client-operate">
          <div className="aside-nav__item" onClick={async () => { await ipcRenderer.invoke("window-min"); }}>
            <MinusOutlined style={{ border: "none" }} />
          </div>
          {
            this.state.isMaximize
              ?
              <div className="aside-nav__item" onClick={async () => { await ipcRenderer.invoke("window-unmax"); }}>
                <SwitcherOutlined style={{ border: "none" }} />
              </div>
              :
              <div className="aside-nav__item" onClick={async () => { await ipcRenderer.invoke("window-max"); }}>
                <BorderOutlined style={{ border: "none" }} />
              </div>
          }
          <div className="aside-nav__item" >
            <CloseOutlined style={{ border: "none" }} onClick={async () => { console.log("close"); await ipcRenderer.invoke("window-close"); }} />
          </div>
        </div>
      </div>
      <webview allowpopups={trueAsStr} style={{ width: '100%', height: "100%", overflow: 'visible' }} src="https://weread.qq.com"></webview>
    </div>
  }
}
