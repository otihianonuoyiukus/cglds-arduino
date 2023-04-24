import { Card, Skeleton, Space, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { unitBodyStyle, unitContentStyle, unitTitleStyle } from "./unit.style";
import { UnitData } from "./unit-data";

const { Title, Text } = Typography;

export const Unit = ({
  id,
  name,
  sensorValue,
  dateTime,
  loading,
}: UnitData) => {
  return (
    <>
      <Space direction="vertical">
        <Card
          size="default"
          hoverable
          title={
            loading ? (
              <Skeleton.Input active={true} size={"default"} />
            ) : (
              <Title level={5} style={unitTitleStyle}>
                {name}
              </Title>
            )
          }
          extra={<SettingOutlined />}
          style={unitBodyStyle}
        >
          <Space direction="vertical" style={unitContentStyle}>
            {loading ? (
              <Skeleton active />
            ) : (
              <>
                <Text>{`ID: ${id}`}</Text>
                <Text>{dateTime?.split(",")[0]}</Text>
                <Text>{dateTime?.split(",")[1]}</Text>
                <Text>{`Value: ${sensorValue}`}</Text>
              </>
            )}
          </Space>
        </Card>
      </Space>
    </>
  );
};
