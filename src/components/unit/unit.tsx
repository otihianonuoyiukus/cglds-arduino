import React from "react";
import { Card, Space, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { unitBodyStyle, unitContentStyle, unitTitleStyle } from "./unit.style";
import { UnitData } from "./unit.data";

const { Title, Text } = Typography;

export const Unit = ({ id, name, sensorValue }: UnitData): JSX.Element => {
  return (
    <>
      <Space direction="vertical">
        <Card
          size="default"
          hoverable
          title={
            <Title level={5} style={unitTitleStyle}>
              {name}
            </Title>
          }
          extra={<SettingOutlined />}
          style={unitBodyStyle}
        >
          <Space direction="vertical" style={unitContentStyle}>
            <Text>{`ID: ${id}`}</Text>
            <Text>{sensorValue}</Text>
          </Space>
        </Card>
      </Space>
    </>
  );
};
