import { Badge, Card, Skeleton, Space, Typography, notification } from "antd";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import {
  unitBodyStyle,
  unitContentStyle,
  unitTitleStyle,
  unitNotificationStyle,
  unitBadgeStyle,
  unitSensorValueWarningStyle,
} from "./unit.style";
import { UnitData } from "./unit-data";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

const MAX_THRESHOLD = import.meta.env.VITE_SENSOR_VALUE_THRESHOLD;

export const Unit = ({
  id,
  name,
  sensorValue,
  dateTime,
  loading,
}: UnitData) => {
  const [notificationOpened, setNotificationOpened] = useState(false);

  const openNotification = () => {
    notification.warning({
      key: id,
      message: "Warning",
      description: "High levels of gas detected!",
      duration: null,
      placement: "bottomRight",
      style: unitNotificationStyle,
    });
  };

  useEffect(() => {
    if (!notificationOpened && (sensorValue || 0) >= MAX_THRESHOLD) {
      openNotification();
      setNotificationOpened(true);
    } else if (notificationOpened && !((sensorValue || 0) >= MAX_THRESHOLD)) {
      notification.destroy(id);
      setNotificationOpened(false);
    }
  }, [notificationOpened, sensorValue]);

  return (
    <>
      <Space direction="vertical">
        <Badge
          count={
            (sensorValue || 0) >= MAX_THRESHOLD ? (
              <ExclamationCircleOutlined style={unitBadgeStyle} />
            ) : null
          }
        >
          <Card
            size="default"
            title={
              loading ? (
                <Skeleton.Input active={true} size={"default"} />
              ) : (
                <Title level={5} style={unitTitleStyle}>
                  {name}
                </Title>
              )
            }
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
                  <Text>
                    {`Value: ${sensorValue} `}
                    {(sensorValue || 0) >= MAX_THRESHOLD && (
                      <WarningOutlined style={unitSensorValueWarningStyle} />
                    )}
                  </Text>
                </>
              )}
            </Space>
          </Card>
        </Badge>
      </Space>
    </>
  );
};
