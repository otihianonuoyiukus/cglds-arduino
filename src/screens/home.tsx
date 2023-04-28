import React, { useEffect, useState } from "react";
import { Card, Divider, Layout, Space, theme, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Unit } from "../components/unit/unit";
import { headerTitleStyle, layoutStyle } from "./home.style";
import { UnitData } from "../components/unit/unit-data";
import { Graph } from "../components/graph/graph";

const { Title } = Typography;

const SENSOR_THRESHOLD = 500;

const registerMessage = {
  type: "register",
  data: {
    clientId: "ADMIN_01",
    type: "admin",
    name: "Admin 1",
  },
};

export const Home = () => {
  const [unitList, setUnitList] = useState<UnitData[]>([]);
  const [socket, setSocket] = useState<WebSocket>();

  const handleOpenValve = (id: string) => {
    if (socket) {
      socket.send("TEST LMAO");
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.86.21:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(JSON.stringify(registerMessage));
    };
    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      console.log(JSON.parse(event.data));
      setUnitList(JSON.parse(event.data));
    };
    ws.onerror = (error) => {
      console.log(error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (unitList.length > 0) {
      unitList.forEach((unit) => {
        if ((unit.sensorValue || 0) > SENSOR_THRESHOLD) {
          //TODO: DO THIS AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        }
      });
    }
  }, [unitList]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="site-layout" style={layoutStyle}>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Space direction="horizontal">
          <Title level={3} style={headerTitleStyle}>
            {"Home"}
          </Title>
        </Space>
      </Header>
      <Card style={{ margin: 20 }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space direction="horizontal" style={{ width: "100%" }}>
              {unitList.length < 1 ? (
                <Unit loading />
              ) : (
                unitList.map((unit) => (
                  <Unit
                    key={unit.id}
                    id={unit.id}
                    name={unit.name}
                    sensorValue={unit.sensorValue}
                    dateTime={unit.dateTime}
                    onOpenValve={handleOpenValve}
                  />
                ))
              )}
            </Space>
            <Divider />
            <Space direction="vertical" style={{ width: "100%" }}>
              {unitList.length < 1 ? (
                <Graph loading />
              ) : (
                <Graph unitList={unitList} />
              )}
            </Space>
          </Space>
        </Content>
      </Card>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};
