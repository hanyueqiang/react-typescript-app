import React from "react";
import { Button } from 'antd'
import style from "./index.less";

const Index: React.FC = () => {
  return (
    <div className={style.container}>
      <Button type="primary">按钮</Button>
      <div>CSSDemo</div>
    </div>
  );
};

export default Index;
