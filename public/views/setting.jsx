import $ from 'jquery';
import React from 'react';
import { Form, Input, Button, Tabs, Radio, InputNumber, Switch } from 'element-react';

import execute from '../utilities/socket.es6';

class Setting extends React.Component {
  constructor(props) {
    super( props );

    this.state = {
      url: '',
      prefix: '',
      autoSave: null,
      interval: 1
    };

    execute({
      $type: 'setting.get',
      field: ['prefix', 'url', 'autoSave', 'interval']
    })
    .then(({result}) => {
      result.interval /= 60000;
      this.setState(result);
    });

    $(document).on('selectstart', () => false);
  }

  handleChangeDir(prefix) {
    execute({
      $type: 'window.dialog',
      title: '设置博客路径',
      properties: ['openDirectory']
    })
    .then(({result: prefix}) => {
      if (prefix.length !== 0) {
        this.setState({ prefix });
      }
    });
  }

  handleChangeSettings(field, value) {
    if (field === 'interval') {
      value = value * 1000 * 60;
    }

    this.setState({[field]: value })
  }

  handleSaveSetting() {
    execute({
      $type: 'setting.set',
      setting: this.state
    }).then(({code}) => {
      if (code === 200) {
        window.close();
      }
    });
  }

  render() {
    const { prefix, url, autoSave, interval } = this.state

    return (
      <div className="flex-col-1 setting-container flex-items-center">
        <Form labelPosition="right" labelWidth="82">
          <Form.Item label="博客路径：">
            <Input placeholder="请设置博客路径" size="small" value={ prefix } readOnly append={ <Button onClick={ this.handleChangeDir.bind(this) }>选择</Button> } />
          </Form.Item>
          <Form.Item label="博客地址：">
            <Input placeholder="请设置博客地址" size="small" value={ url } onChange={ this.handleChangeSettings.bind(this, 'url') } />
          </Form.Item>
          <Form.Item label="自动保存：">
            <Switch
              onText="开启"
              offText="关闭"
              value={autoSave}
              onChange={this.handleChangeSettings.bind(this, 'autoSave')}
            />
          </Form.Item>
          {
            autoSave ? (
              <Form.Item label="触发频率：">
                <InputNumber size="small"
                  min="1"
                  max="5"
                  defaultValue={ typeof interval !== 'number' || isNaN(interval) ? 5 : interval }
                  onChange={ this.handleChangeSettings.bind(this, 'interval') }
                />
              </Form.Item>
            ) : null
          }
          <Form.Item className="fixed-bottom">
            <div className="pull-right">
              <button className="form-btn" onClick={ () => window.close() }>取消</button>
              <input className="form-btn" type="submit" value="应用" onClick={ this.handleSaveSetting.bind(this) } />
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Setting;
