import React, { useState, useEffect, useContext } from 'react';
import { Input, Button, Icon, message } from 'antd';
import './Login.scss';
import { postLogin } from '../client/UserHelper';
import { History, Location } from 'history';
import { withRouter, match } from 'react-router';
import { IsLoginContext } from './IsLoginContext';

interface PropsType {
  history: History;
  location: Location;
  match: match;
};

const Login: React.FC<PropsType> = ({ history }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPwd, setIsShowPwd] = useState(false);
  const { setIsLogin } = useContext(IsLoginContext);

  // 查是否为空
  const checkEmpty = () => {
    if (user !== '' && password !== '') {
      return true;
    }
    message.warning(`${user === '' ? '账号' : '密码'}不可为空`);
    return false;
  }
  
  // 登录
  const submitLogin = async () => {
    if (!checkEmpty()) {
      return;
    }
    let params = {
      username: user,
      userpword: password
    };
    let res = await postLogin(params);
    if (res) {
      setIsLogin(true);  // 将 context 的 isLogin 设置为 true
      sessionStorage.setItem("xia_username", user);
      sessionStorage.setItem("xia_password", window.btoa(password));
      message.success("登录成功");
      history.push("/admin");
    } else {
      message.error("密码错误或用户不存在，请重新输入");
      setPassword('');
    }
  }

  return (
    <div className="Login">
      <div className="loginCont">
        <div className="loginBox">
          <span className="please">Please Login:</span>
          <Input
            className="user-input"
            placeholder="请输入用户名"
            size="large"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            onPressEnter={submitLogin}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
          <Input
            className="pwd-input"
            type={isShowPwd ? 'text' : 'password'}
            placeholder="请输入密码"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={submitLogin}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            suffix={
              <Icon className="pwd-eye" type={!isShowPwd ? 'eye' : 'eye-invisible'} style={{ color: 'rgba(0,0,0,.25)' }} onClick={() => setIsShowPwd(!isShowPwd)}/>
            } />
          <Button className="login-button" type="primary" size="large" htmlType="submit" onClick={submitLogin}>登录</Button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);