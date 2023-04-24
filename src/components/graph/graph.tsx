import React, { useEffect, useRef, useState } from "react";
import { Card, Space, Typography } from "antd";
import { Line } from "@ant-design/plots";
import { graphBodyStyle, graphTitleStyle } from "./graph.style";
import { GraphData } from "./graph-data";
import { UnitData } from "../unit/unit-data";

const MAX_SIZE = 50;

export const Graph = ({ unitList }: GraphData) => {
  const [data, setData] = useState<UnitData[]>([]);
  const unitListRef = useRef(unitList);

  useEffect(() => {
    if ((unitList?.length || 0) > 0) {
      unitListRef.current = unitList;
    } else {
      setData([]);
    }
  }, [unitList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        unitListRef.current?.forEach((unit) => {
          newData.push(unit);
        });
        if (newData.length > MAX_SIZE) {
          newData.splice(0, newData.length - MAX_SIZE);
        }
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    data,
    xField: "dateTime",
    yField: "sensorValue",
    seriesField: "name",
    animation: false,
  };

  return (
    <Card size="default" hoverable style={graphBodyStyle}>
      <Line {...config} style={{ width: "100%" }} />
    </Card>
  );
};
