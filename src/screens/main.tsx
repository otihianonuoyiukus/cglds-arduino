import { Layout } from "antd";
import { useState } from "react";
import { SideMenu } from "../components/side-menu/side-menu";
import { Home } from "./home";

export const Main = (): JSX.Element => {
  const [currentScreen, setCurrentScreen] = useState("Home");

  const handleScreenChange = (input: string): void => {
    setCurrentScreen(input);
  };

  return (
    <Layout hasSider>
      <SideMenu handleScreenChange={handleScreenChange} />
      {currentScreen === "Home" && <Home />}
    </Layout>
  );
};
