import { React, useState } from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Thumbnail,
  Modal,
  TextContainer,
  SettingToggle,
  Banner,
} from "@shopify/polaris";

const InstallScript = () => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    fetch("/installScriptTags").then((resp) => {
      setActive((active) => !active);
      console.log(resp);
    });
  };

  const contentStatus = active ? "Uninstall" : "Installed";
  const textStatus = active ? "installed" : "not installed";

  if (active) {
    return <Banner title="You have installed the script" status="success" />;
  } else {
    return (
      <>
        <SettingToggle
          action={{
            content: contentStatus,
            onAction: handleToggle,
          }}
          enabled={active}
        >
          The script is <TextStyle variation="strong">{textStatus}</TextStyle>.
        </SettingToggle>
      </>
    );
  }
};

export default InstallScript;
