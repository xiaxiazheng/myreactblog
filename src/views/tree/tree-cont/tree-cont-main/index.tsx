import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import TestKeepAlive from "./test-keep-alive";
import TestVirtualScroll from './test-virtual-scroll'

const TreeContMain: React.FC = () => {
  const list = ['A','B','C','D','E','F','G'];
  const [active, setActive] = useState<string>('A');
  const [already, setAlready] = useState<string[]>([]);

  useEffect(() => {
    if (!already.includes(active)) {
      setAlready([...already, active]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className={styles.treecontmain}>
      {/* keep-alive */}
      <div>测试用数组实现的组件 keep-alive，原理 list.map + 判断条件，还有 display: none</div>
      <div className={styles.router}>
        点击切换路由：
        {list.map((item) => (
          <span onClick={() => setActive(item)}>{item}</span>
        ))}
      </div>
      <div>
        具体组件：
        {list.map((item) => {
          if (already.includes(item)) {
            return (
              <div style={{ display: item === active ? "block" : "none" }}>
                <TestKeepAlive key={item} flag={item} />
              </div>
            );
          } else {
            return (
              <>
                {item === active && (
                  <div>
                    <TestKeepAlive key={item} flag={item} />
                  </div>
                )}
              </>
            );
          }
        })}
      </div>
      <br />
      {/* 虚拟滚动 */}
      <div>测试虚拟滚动 virtual scroll</div>
      <TestVirtualScroll />
    </div>
  );
};

export default TreeContMain;
