import React, { useState } from "react";
import { Layout, Space, theme, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Unit } from "../components/unit/unit";
import { headerTitleStyle, layoutStyle } from "./home.style";
import { UnitData } from "../components/unit/unit.data";

const { Title } = Typography;

const dummyData: UnitData[] = [
  { id: "1", name: "Kitchen", sensorValue: 123 },
  { id: "2", name: "Living Room", sensorValue: 459 },
  { id: "3", name: "Bathroom", sensorValue: 562 },
];

export const Home = () => {
  const [unitList, setUnitList] = useState<UnitData[]>([]);

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
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Space direction="horizontal">
          {unitList.map((unit) => (
            <Unit
              id={unit.id}
              name={unit.name}
              sensorValue={unit.sensorValue}
            />
          ))}
        </Space>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};
